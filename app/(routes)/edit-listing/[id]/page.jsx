"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Formik } from "formik";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import FileUpload from "../_components/FileUpload";
import { Loader } from "lucide-react";

const EditListing = ({params}) => {

  //get user from clerk
  const { user } = useUser();

  //navigation
  const router = useRouter();

  // to save d
  const [listing, setListing] = useState([]);

  //
  const [images, setImages] = useState([]);

  //loading
  const [loading, setLoading] = useState(false);


  useEffect(() => {
      //console.log(params.split('/') [2])
      user&&verifyUserRecord();
  }, [user]);

  //to verify if the user record exists, fetch the data and redirects to respective page
  const verifyUserRecord = async () => {
    const {data, error} = await supabase
    .from('listing')
    .select('*, listingImages(listing_id, url)')
    .eq('createdBy', user?.primaryEmailAddress.emailAddress)
    .eq('id', params.id);

    if (data)
    {
      console.log(data);
      setListing(data[0]);
    }

    //go to homepage if no record of user is found
    if(data?.length<=0)
    {
      router.replace('/')
    }

  }

//submit handler function
  const onSubmitHandler = async (formValue) => {
    setLoading(true);

    const { data, error } = await supabase
    .from('listing')
    .update(formValue)
    .eq('id', params.id)
    .select();

    //toast appears when data is successfully updated
    if (data) {
      console.log(data);
      toast('Listing Updated and Published');
    }

    // store the images one by one into the supabase using for each loop
    for (const image of images)
    {
      const file = image;
      const fileName = Date.now().toString();
      const fileExt = fileName.split('.').pop();
      const { data, error } = await supabase.storage
      .from('listingimages')
      .upload(`${fileName}`, file, {
        contentType: `image/${fileExt}`,
        upsert: false
      });

      if (error)
      {
        setLoading(false);
        toast('Error while uploading images')
      }
      else {
        const imageUrl=process.env.NEXT_PUBLIC_IMAGE_URL+fileName;
        // console.log(imageUrl);
        const { data, error } = await supabase
        .from('listingImages')
        .insert([
          {url: imageUrl, listing_id:params?.id}
        ])
        .select();
        if (error) 
        {
          setLoading(false);
        }
      }
      setLoading(false);
  }

};
return (
  <div className="px-10 md:px-36 my-10">


    <h2 className="font-bold text-2xl">
      Enter some more details about your listing
    </h2>

    <Formik
    initialValues={{
      type:'',
      propertyType:'',
      profileImage: user?.imageUrl,
      fullName: user?.fullName
    }}
    onSubmit={(values) => {
      console.log(values);
      onSubmitHandler(values);
    }}
    >
      {({
        values,
        handleChange,
        handleSubmit
      }) => (
        <form onSubmit={handleSubmit}>
        <div>
            <div className="p-5 rounded-lg shadow-md grid gap-7 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Radio buttons for rent or sell from shad-cn make sure to install the radioButtons */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg text-slate-500">Rent or Sell?</h2>
                  <RadioGroup  defaultValue={listing?.type} onValueChange={(v) => values.type=v}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Rent" id="Rent" />
                      <Label htmlFor="Rent" className='text-lg'>Rent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Sell" id="Sell" />
                      <Label htmlFor="Sell" className='text-lg'>Sell</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* install the Select component from shad-cn for the select */}
                {/* select property type */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-lg text-slate-500">Property Type</h2>
                  <Select onValueChange={(e) => values.propertyType=e} name="propertyType" defaultValue={listing?.propertyType} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder={listing?.propertyType ? listing?.propertyType : "Select Property Type"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family House">
                        Single Family House
                      </SelectItem>
                      <SelectItem value="Town House">Town House</SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* second Row includes bedrooms and bathroom */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Bedroom</h2>
                  <Input type="number" min="1" placeholder="Ex.2" defaultValue={listing?.bedroom} name="bedroom" onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Bathroom</h2>
                  <Input type="number" placeholder="Ex.3"  defaultValue={listing?.bathroom} name="bathroom" onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Built In</h2>
                  <Input type="number" placeholder="Ex.40 sq.ft"  defaultValue={listing?.builtIn} name="builtIn" onChange={handleChange}/>
                </div>
              </div>

              {/* third Row includes parking spaces, Lot size, and Area */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Parking</h2>
                  <Input type="number" placeholder="Ex.2"  defaultValue={listing?.parking} name="parking" onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Lot Size(Sq.Ft)</h2>
                  <Input type="number" placeholder="Ex.3"  defaultValue={listing?.lotSize} name="lotSize" onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Area(Sq.Ft)</h2>
                  <Input type="number" placeholder="Ex.1900"  defaultValue={listing?.area} name="area" onChange={handleChange}/>
                </div>
              </div>

              {/* fourth Row includes selling price and HOA/month */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">Selling Price ($)</h2>
                  <Input type="number" placeholder="400,000"  defaultValue={listing?.price} name="price" onChange={handleChange}/>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500">HOA (Per Month) ($)</h2>
                  <Input type="number" placeholder="100"  defaultValue={listing?.hoa} name="hoa" onChange={handleChange}/>
                </div>
              </div>

              {/* Description of property */}
              <div className="grid grid-cols-1 gap-10">
                <div className="flex gap-2 flex-col">
                  <h2 className="text-gray-500">Description</h2>
                  <Textarea placeholder="More Details..."  defaultValue={listing?.description} name="description" onChange={handleChange}/>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <h2 className="text-lg text-gray-500 my-2">Upload Property Images</h2>
                <FileUpload 
                setImages={(value) =>setImages(value)}
                //to make 6the image we uploaded show in the preview section
                imageList = {listing.listingImages}
                />
              </div>

              {/* save buttons */}
              <div className="flex gap-7 justify-end">
                <Button variant="outline" className="text-primary border-primary">
                  Save
                </Button>
                <Button disabled={loading} className="">
                  {loading ? <Loader /> : 'Save & Publish'} 
                </Button>
              </div>
            </div>
        </div>
        </form>)}
    </Formik>


  </div>
);
}

export default EditListing;
