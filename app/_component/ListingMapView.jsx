"use client"
import React, { useEffect, useState } from 'react'
import Listing from './Listing'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'

const ListingMapView = ({type}) => {

    //To save all the listing we fetched in a useState hook
    const [listing, setListing] = useState([]);
    const [searchedAddress, setSearchedAddress] = useState([]);
    const [bedCount, setBedCount] = useState(0);
    const [bathCount, setBathCount] = useState(0);
    const [parkingCount, setParkingCount] = useState(0);
    const [homeType, setHomeType] = useState();


    useEffect(() => {
        getLatestListing();
    }, [bedCount, bathCount, parkingCount, homeType]) // Trigger on filter change

    const getLatestListing = async () => {
        let query = supabase
        .from('listing')
        .select(`*, listingImages(
            url,
            listing_id
        )`)
        .eq('active', true)
        .eq('type', type)
        .gte('bedroom', bedCount)
        .gte('bathroom', bathCount)
        .gte('parking', parkingCount)
        .order('id', { ascending: false })
        
        if (homeType)
        {
            query=query.eq('propertyType', homeType)
        }

        const {data, error} = await query;
        if (data)
        {
            // console.log(data);
            setListing(data);
        }
        if (error) {
            toast('Server Side Error')
        }
    }

    //linked to Listing.jsx
    const handleSearchClick = async () => {
        console.log(searchedAddress);
        const searchedTerm = searchedAddress?.value?.structured_formatting?.main_text
        const {data, error} = await supabase
        .from('listing')
        .select(`*, listingImages(
            url,
            listing_id
        )`)
        .eq('active', true)
        .eq('type', type)
        .like('address', '%'+searchedTerm+'%')
        .order('id', { ascending: false })
        

        if (data)
        {
            setListing(data);
        }
    }
  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
        <div>
            <Listing listing={listing} 
            handleSearchClick={handleSearchClick} 
            searchedAddress={(v) => setSearchedAddress(v)}
            setBathCount={setBathCount}
            setBedCount={setBedCount}
            setParkingCount={setParkingCount}
            setHomeType={setHomeType}
            />
        </div>


        {/* Map section on the right */}
        <div>
            Map
        </div>
    </div>
  )
}

export default ListingMapView