import React from "react";
import { Button, Input } from 'reactstrap';
import { confirmAlert } from 'react-confirm-alert'; // Import
import '../assets/css/Dialog.css';

export const confirmDialog = (title, body, callback) => {
   const options = {
      customUI: ({ onClose }) => {
         return (
           <div className='react-confirm-alert-body'>
               <h1>{title}</h1>
               <p>{body}</p>
               <Button 
                  className="pl-4 pr-4 pt-2 pb-2"
                  color="primary"
                  onClick={() => {
                  callback();
                  onClose();
                  }}
               >
                  Yes
               </Button>
               <Button color="secondary" className="ml-2 pl-4 pr-4 pt-2 pb-2" onClick={onClose}>No</Button>
           </div>
         );
      },
      closeOnEscape: true,
      closeOnClickOutside: true
   };
   confirmAlert(options);
}

export const createBoardDialog = (callback) => {
   const options = {
      customUI: ({ onClose }) => {
         return (
           <div className='react-confirm-alert-body'>
               <h1>Create new board</h1>
               <div className="mt-4 mb-4">
                  <Input type="text" name="title" placeholder="Enter board title..." id={'create-board-input'}/>
               </div>
               <Button 
                  className="pl-4 pr-4 pt-2 pb-2"
                  color="primary"
                  onClick={() => {
                  callback(document.getElementById('create-board-input').value);
                  onClose();
                  }}
               >
                  Create Board
               </Button>
               <Button color="secondary" className="ml-2 pl-4 pr-4 pt-2 pb-2" onClick={onClose}>Cancel</Button>
           </div>
         );
      },
      closeOnEscape: true,
      closeOnClickOutside: true
   };
   confirmAlert(options);
}