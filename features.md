1. Can use websocket for lastuse thing in /workflow page
2. Can use zustand for /workflow and /connection as we dont want x number of api calls everytime user comes to that page , we will store dta on zustand and if there is some change then make a db call on some server action and put tht it in zustand store.ts

<!-- GOOGLE DRIVE NODE -->
<!-- Make a from like this  -->

1. Google drive as trigger => We will give 3 options 1.watch a file , 2. Create file in folder 3. update file in folder

1) if watch a file , then we will select a file from list of files in ui (select dropper)
2) If create a file in folder is there , then we will make user select folder and we can go as deep as we can till user have folder
