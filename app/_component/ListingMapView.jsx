"use client"
import React, { useEffect, useState } from 'react'
import Listing from './Listing'
import { supabase } from '@/utils/supabase/client'
import { toast } from 'sonner'
import GoogleMapSection from './GoogleMapSection'

const ListingMapView = ({type}) => {

    //To save all the listing we fetched in a useState hook
    const [listing, setListing] = useState([]);
    const [searchedAddress, setSearchedAddress] = useState([]);
    const [bedCount, setBedCount] = useState(0);
    const [bathCount, setBathCount] = useState(0);
    const [parkingCount, setParkingCount] = useState(0);
    const [homeType, setHomeType] = useState();
    const [coordinates, setCoordinates] = useState();


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

    //The Search functionality and  Features filter section
    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
        <div>
            <Listing listing={listing} 
            handleSearchClick={handleSearchClick} 
            searchedAddress={(v) => setSearchedAddress(v)}
            setBathCount={setBathCount}
            setBedCount={setBedCount}
            setParkingCount={setParkingCount}
            setHomeType={setHomeType}
            setCoordinates={setCoordinates}
            />
        </div>


        {/* Map section on the right */}
        <div className='hidden fixed right-6 h-full md:block md:w-[350px] lg:w-[450px] xl:w-[650px]'>
            <GoogleMapSection 
                listing={listing}
                coordinates={coordinates}
            />
        </div>
    </div>
  )
}

export default ListingMapView