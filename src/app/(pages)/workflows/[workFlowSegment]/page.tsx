"use client";
import { Button } from '@/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

function WorkFlowSegment() {
  const {workFlowSegment} = useParams<{workFlowSegment : string}>();
  const router = useRouter();
    const path = `/workflows/editor/${workFlowSegment}`;
    console.log(path);
  return (
    // now here get the nodes used in the workflow and display them , and ask for the necessary inputs
    <div>
        {workFlowSegment}
        <br />
        <Button variant="outline" className="bg-green-600" onClick={()=>router.push(path)}>Save and Continue</Button>
    </div> 
  );
}

export default WorkFlowSegment;