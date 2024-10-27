import { NextResponse } from 'next/server';
import { addLabel } from '@/app/api/google';

export async function POST(request: Request) {
  const data = await request.json();

  const result = await addLabel(data);

  return NextResponse.json(result);
}

// when u want to add label , then we have to ask user that on which mail they want to do this operation , and which lbel they want to add
// now they have already labels , and we can get them , show there name to user and we will hve there id , send that id to this api , and
// the label will be added to that mail => now on which mail ? so either we can ask user to provide mail , by showing them many mail or we can create a mail and put that label on that mail
// const handleAddLabelClick = async () => {
//     const res1 = await fetch("/api/google/gmail/listLabels", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//     const res1_2 = await res1.json()
//     console.log(res1_2);

//     const res2 = await fetch("/api/google/gmail/listMessages", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body : JSON.stringify({maxResults: 10})
//     })
//     const res2_2 = await res2.json();
//      console.log(res2_2);

//     const dummyData = {
//       messageId: "19262010d47de75b", // Using the provided email ID
//       labelId: "Label_1532239860686980654", // Replace with actual dummy label ID
//     };

//     const response = await fetch("/api/google/gmail/addLabel", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(dummyData),
//     });

//     const result = await response.json();
//     setAddLabelResult(JSON.stringify(result, null, 2));
//   };
