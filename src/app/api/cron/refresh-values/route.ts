import { NextRequest, NextResponse } from 'next/server';
import { fetchAllSources } from '@/lib/valueFetchers';
import { aggregateAllPetValues } from '@/lib/valueAggregator';
import { supabase } from '@/lib/supabase';

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// to refresh values every 5-10 minutes

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch values from all sources
    const allValues = await fetchAllSources();
    
    if (allValues.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'No values fetched from sources' 
      }, { status: 500 });
    }

    // Aggregate values
    const aggregatedValues = aggregateAllPetValues(allValues);

    // Store in Supabase
    const timestamp = new Date().toISOString();
    
    // Delete old values (optional: keep history if needed)
    await supabase.from('pet_values').delete().lt('last_updated', 
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    );

    // Insert new values
    const insertPromises = allValues.map(async (value) => {
      return supabase.from('pet_values').upsert({
        pet_name: value.petName,
        source: value.source,
        variant: 'normal', // Default variant, can be expanded
        value: value.value,
        currency: value.currency,
        last_updated: value.timestamp.toISOString(),
      });
    });

    await Promise.all(insertPromises);

    // Update aggregated values
    const aggregatePromises = aggregatedValues.map(async (aggregated) => {
      return supabase.from('aggregated_values').upsert({
        pet_name: aggregated.petName,
        variant: 'normal', // Default variant
        average_value: aggregated.averageValue,
        min_value: aggregated.minValue,
        max_value: aggregated.maxValue,
        currency: aggregated.currency,
        confidence: aggregated.confidence,
        sources_count: aggregated.sources.length,
        last_updated: aggregated.lastUpdated.toISOString(),
      });
    });

    await Promise.all(aggregatePromises);

    return NextResponse.json({
      success: true,
      message: `Successfully refreshed ${allValues.length} values from ${new Set(allValues.map(v => v.source)).size} sources`,
      timestamp,
    });
  } catch (error) {
    console.error('Error in cron refresh:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to refresh values' 
    }, { status: 500 });
  }
}

// For Vercel Cron Jobs, add this to vercel.json
// See README for cron configuration
