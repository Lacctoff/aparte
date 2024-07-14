"use client"
import GoogleAddressSearch from '@/app/_component/GoogleAddressSearch';
import { Button } from '@/components/ui/button';
import { supabase } from '@/utils/supabase/client';
import { useUser } from '@clerk/nextjs';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

const AddNewListing = () => {

    const [loader, setLoader] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState();
    const [coordinates, setCoordinates] = useState();
    // getting user that is signed in from clerk
    const {user} = useUser();

    const router = useRouter();

    //we are inserting into the supabase backend when we click on the Next button which in turn calls the nextHandler
    const nextHandler = async () => {
        setLoader(true)
        const { data, error } = await supabase
        .from('listing')
        .insert([
        { address: selectedAddress.label, 
            coordinates: coordinates,
            createdBy: user?.primaryEmailAddress.emailAddress
        },
        ])
        .select()
            
        //condition statement if we are creating data
        if (data) {
            setLoader(false);
            console.log("New Data added,", data);
            toast("New Address Added for listing");
            router.replace('/edit-listing/' + data[0].id); //redirects us to the edit-listing page after clicking next
        }
        if (error) {
            setLoader(false);
            console.log('error');
            toast("Server side error")
        }
    }

return (
    <div className='mt-10 md:mx-56 lg:mx-80'>
    <div className="p-10 flex flex-col gap-5 items-center justify-center ">
        <h2 className="font-bold text-2xl">Add New Listing</h2>
        <div className='p-10 rounded-lg border w-full shadow-md flex flex-col gap-5'>
        <h2 className="text-gray-500">Enter property address for Listing</h2>
        <GoogleAddressSearch 
            selectedAddress={(value)=> setSelectedAddress(value)}
            setCoordinates={(value)=> setCoordinates(value)}
        />
        <Button 
        onClick={nextHandler}
        disabled={!selectedAddress||!coordinates || loader}
        >
            {loader ? <Loader className='animate-spin'/> : 'Next'}
        </Button>
    </div>
    </div>
    </div>
    );
}

export default AddNewListing