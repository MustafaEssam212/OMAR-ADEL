
import Head from 'next/head'
import React, { useState, useRef, useEffect } from 'react';
import { TbRefresh } from "react-icons/tb";
import { FaCopy } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { FaTrash } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaSave } from "react-icons/fa";
import jsonFile from '@/public/arrayData.json'
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Flip} from 'react-toastify';


export default function Home() {

  const [inputText, setInputText] = useState('');
  const [OpenModal, setOpenModal] = useState(false);
  const [Result, setResult] = useState('');

  const toggleModal = () => {
    setOpenModal(prev => !prev);
  };

  const innerModalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (innerModalRef.current && !innerModalRef.current.contains(event.target)) {
        // Clicked outside the modal, close it
        setOpenModal(false);
      }
    };

    if (OpenModal) {
      // Attach event listener when modal is open
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove event listener when modal is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [OpenModal]);


  const [arr, setArr] = useState(jsonFile);
  const [idCounter, setIdCounter] = useState(0);
  const [buttonText, setButtonText] = useState('Copy');

  const handleAdd = () => {
    setArr([...arr, {id: idCounter, name: null, value: null}]);
    setIdCounter(idCounter + 1)
  }


  const handleRemove = (e) => {
    const filter = arr.filter((obj) => obj.id !== e);
    setArr(filter)
  }


  const handleEdit = (id, text, type) => {
    setArr(prevArr => (
      prevArr.map(obj => {
        if (obj.id === id) {
          // Update the specified field with the new value
          if (type === 'name') {
            return { ...obj, name: text };
          } else {
            return { ...obj, value: text };
          }
        }
        return { ...obj }; // Return the unchanged object if the id doesn't match
      })
    ));
  };
  

  const handleSave = async () => {
    const res = await fetch(`/api/hello`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(arr)
    })

    const data = await res.json();

    if(data.message === 'JSON file has been saved successfully'){
      toast.success(data.message)
    }else{
      toast.error(data.error)
    }

  }


  const checkIdCounter = () =>{
    if(jsonFile.length){
      const lastObject = jsonFile[jsonFile.length - 1];
      setIdCounter(lastObject.id + 1)
    }else{
      setIdCounter(1)
    }
  }


  useEffect(() => {
    checkIdCounter();
  }, [])

  useEffect(() => {
    checkIdCounter();
  }, [jsonFile])


  const getRecord = () => {
    if(jsonFile.length){
      const filter = jsonFile.find((obj) => obj.name === inputText);
      
      if(filter){
        setResult(filter.value)
      }else{
        toast.error('There is no record of this name')
      }

    }else{
      toast.error('No saved records')
    }
  }


  const copy = () => {
    const textToCopy = document.getElementById('textToCopy').innerText;
    navigator.clipboard.writeText(textToCopy)
    .then(()=> {
      toast.success('Copied')
    })
  }
  
  return (
    <div className='AppContainer'>


                  <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar
                  newestOnTop={true}
                  closeOnClick
                  rtl={true}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  theme="colored"
                  transition= {Flip}
                  />

      <Head>
        <title>OMAR ADEL'S PROJECT</title>
      </Head>


      {OpenModal &&
          <div className='Modal'>
        
            <div ref={innerModalRef} className='InnerModal'>


              <div className='ModalBody'>


                


                {
                  arr.map((e, key) => {
                    return(
                          <div key={key} className='Input'>

                          <textarea value={e.name} onChange={(s) => handleEdit(e.id, s.target.value, 'name')} placeholder='Name'></textarea>
                          <textarea value={e.value} onChange={(s) => handleEdit(e.id, s.target.value, 'value')} placeholder='Value'></textarea>
                          <button><FaTrash onClick={()=> handleRemove(e.id)} className='Icon' /></button>


                          </div>
                    )
                  })
                }


                <button className='Add' onClick={handleAdd}><FaPlus className='Icon' /></button>
              </div>

              <div className='Save'>
                  <button onClick={handleSave}><FaSave className='Icon' /> Save</button>
              </div>


            </div>
          </div>
    }


      <div className='Inputs-Container'>

          <div className='Left'>
              <textarea placeholder='Name' onChange={(s) => setInputText(s.target.value)}></textarea>
              <button onClick={getRecord}><TbRefresh className='Icon' /> Recall</button>
          </div>


          <div className='Right'>
              <p id="textToCopy">{Result ? Result : 'Value'}</p>
              <button onClick={copy}><FaCopy className='Icon' /> Copy</button>
          </div>




      </div>

      <button onClick={()=> setOpenModal(true)} className='Settings'><IoIosSettings className='Icon' /></button>
    </div>
  );
}
