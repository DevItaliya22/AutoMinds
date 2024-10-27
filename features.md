1. Can use websocket for lastuse thing in /workflow page
2. Can use zustand for /workflow and /connection as we dont want x number of api calls everytime user comes to that page , we will store dta on zustand and if there is some change then make a db call on some server action and put tht it in zustand store.ts

<!-- GOOGLE DRIVE NODE -->
<!-- Make a from like this  -->

1. Google drive as trigger => We will give 3 options 1.watch a file , 2. Create file in folder 3. update file in folder

1) if watch a file , then we will select a file from list of files in ui (select dropper)
2) If create a file in folder is there , then we will make user select folder and we can go as deep as we can till user have folder


<!-- Todos -->  
add confirmationw when user dont save workflow and try ton exit , points of exits are => from  navbar and exit Editor button and onCloseWindow 

delete node feature , now we also on BE have to check that if numbeer of node coming from fe < database then user have deleted it , so hashset etc

redirect user from /signin page if alreafy logge din 

Hardes thing to implement is CTRL+Z thing as this undo redo cannot be achived without storing the complete state on zustand and so this would be probably the last thing to achieve 

in /workflows , draft active and inactive thing is still baki , so when we publish , we have to make it active and then make than publish buttton to unpublish and there we will make it inactive  draft isfor editing thing only , then we will play with active  and inactive 