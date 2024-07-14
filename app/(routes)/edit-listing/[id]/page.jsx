"use client";
import React, { useEffect } from "react";
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

const EditListing = ({params}) => {

  //get user
  const { user } = useUser();

  //navigation
  const router = useRouter();


  useEffect(() => {
      //console.log(params.split('/') [2])
      user&&verifyUserRecord();
  }, [user]);

  //to verify if the user record exists
  const verifyUserRecord = async () => {
    const {data, error} = await supabase
    .from('listing')
    .select('*')
    .eq('createdBy', user?.primaryEmailAddress.emailAddress)
    .eq('id', params.id);

    if(data?.length<=0)
    {
      router.replace('/')
    }

  }

//submit handler function
  const onSubmitHandler = async (formValue) => {

    const { data, error } = await supabase
    .from('listing')
    .update(formValue)
    .eq('id', params.id)
    .select();

    if (data) {
      console.log(data);
      toast('Listing Updated and Published');
    }
            
  }
  return (
    <div className="px-10 md:px-36 my-10">


      <h2 className="font-bold text-2xl">
        Enter some more details about your listing
      </h2>

      <Formik
      initialValues={{
        type:'',
        propertyType:''
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
                    <RadioGroup defaultValue="Sell" onValueChange={(v) => values.type=v}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Rent" id="Rent" />
                        <Label htmlFor="Rent">Rent</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="Sell" id="Sell" />
                        <Label htmlFor="Sell">Sell</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* install the Select component from shad-cn for the select */}
                  {/* select property type */}
                  <div className="flex flex-col gap-2">
                    <h2 className="text-lg text-slate-500">Property Type</h2>
                    <Select onValueChange={(e) => values.propertyType=e} name="propertyType">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Property Type" />
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
                    <Input type="number" min="1" placeholder="Ex.2" name="bedroom" onChange={handleChange}/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-gray-500">Bathroom</h2>
                    <Input type="number" placeholder="Ex.3" name="bathroom" onChange={handleChange}/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-gray-500">Built In</h2>
                    <Input type="number" placeholder="Ex.40 sq.ft" name="builtIn" onChange={handleChange}/>
                  </div>
                </div>

                {/* third Row includes parking spaces, Lot size, and Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-gray-500">Parking</h2>
                    <Input type="number" placeholder="Ex.2" name="parking" onChange={handleChange}/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-gray-500">Lot Size(Sq.Ft)</h2>
                    <Input type="number" placeholder="Ex.3" name="lotSize" onChange={handleChange}/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-gray-500">Area(Sq.Ft)</h2>
                    <Input type="number" placeholder="Ex.1900" name="area" onChange={handleChange}/>
                  </div>
                </div>

                {/* fourth Row includes selling price and HOA/month */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-gray-500">Selling Price ($)</h2>
                    <Input type="number" placeholder="400,000" name="price" onChange={handleChange}/>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-gray-500">HOA (Per Month) ($)</h2>
                    <Input type="number" placeholder="100" name="hoa" onChange={handleChange}/>
                  </div>
                </div>

                {/* Description of property */}
                <div className="grid grid-cols-1 gap-10">
                  <div className="flex gap-2 flex-col">
                    <h2 className="text-gray-500">Description</h2>
                    <Textarea placeholder="More Details..." name="description" onChange={handleChange}/>
                  </div>
                </div>
                {/* save buttons */}
                <div className="flex gap-7 justify-end">
                  <Button variant="outline" className="text-primary border-primary">
                    Save
                  </Button>
                  <Button className="">Save & Publish</Button>
                </div>
              </div>
          </div>
          </form>)}
      </Formik>


    </div>
  );
};

export default EditListing;
