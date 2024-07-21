"use client"
import { supabase } from '@/utils/supabase/client'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import Slider from '../_components/Slider'
import Details from '../_components/Details'

const ViewListing = ({params}) => {
  //first we need to fetch the listing information

  //A use effect hook used to execute 6the GetListingDetail once 
  useEffect(() => {
    GetListingDetail();
  }, [])

  //After fetching the data the useState hook stores the data and allows us use it in our code
  const [listingDetail, setListingDetail] = useState();

  const GetListingDetail = async () => {
    const {data, error} = await supabase
    .from('listing')
    .select('*, listingImages(listing_id, url)')
    .eq('id',params.id)
    .eq('active', true);

    if (data) 
    {
      setListingDetail(data[0]);
    }
    if (error)
    {
      toast('Server side error!')
    }
  }
  return (
    <div className='px-4 md:px-32 lg:px-56 py-3'>
        <Slider imageList={listingDetail?.listingImages} />
        <Details listingDetail={listingDetail} />
    </div>
  )
}

export default ViewListing