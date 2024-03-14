import { Table, Modal, Button} from 'flowbite-react';
import React from 'react'
import { useEffect,useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {HiOutlineExclamationCircle} from 'react-icons/hi';
import { ImLocation } from "react-icons/im";
import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { TiCamera } from "react-icons/ti";
import { FaTicketAlt } from "react-icons/fa";
import { MdOutlineDriveFileRenameOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";


const DashEvents = () => {
  const {currentUser}=useSelector((state)=>state.user)
const [userEvents,setUserEvents]=useState([]);
const[showMore,setShowMore]=useState(true);
const[showModal,setShowModal]=useState(false);
const [eventIdToDelete,setEventIdToDelete]=useState('');




useEffect(()=>{
const fetchEvents=async()=>{
  try{
    const res=await fetch(`/api/event/getEvents?userId=${currentUser._id}`)
    const data=await res.json()
    console.log(data);
    if(res.ok)
    {
      setUserEvents(data.event)
      if(data.events.length<9){
        setShowMore(false);
      }
    }
  }catch(error)
  {
    console.log(error.message)
  }
}
if(currentUser.isAdmin)
{
  fetchEvents();
}
},[currentUser._id])


const handleShowMore=async()=>{
  const startIndex=userEvents.length;
  try{
    const res=await fetch(`api/event/getEvents?userid=${currentUser._id}&startIndex=${startIndex}`);
    const data=await res.json();
    if(res.ok){
      setUserEvents((prev)=>[...prev,...data.event]);
      if( data.events.length < 9){

        setShowMore(false);
        
      }
    }
  } catch(error)
  {
    console.log(error.message);
  }
}

const handleDeleteEvent=async()=>{
  setShowModal(false);
  try{
const res=await fetch(
  `/api/event/deleteEvent/${eventIdToDelete}/${currentUser._id}`,
  {
  method:'DELETE',
}
);
const data=await res.json();
if(!res.ok)
{
  console.log(data.message);
}
else{
  setUserEvents((prev)=>prev.filter((event)=>event._id!==eventIdToDelete));//to update the posts and filter out those who aren't deleted
}

}catch(error){
    console.log(error.message);
  }

}


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userEvents.length>0?(
<>
<Table hoverable className='shadow-md'> 
<Table.Head>
  
  <Table.HeadCell className='flex justify-center'><FaRegCalendarAlt size={25} /></Table.HeadCell>
  <Table.HeadCell className='item-center'><MdOutlineAccessTimeFilled size={25} /></Table.HeadCell>
  
  <Table.HeadCell>Ticket Types</Table.HeadCell>
  <Table.HeadCell className='flex justify-center'><TiCamera size={25}/></Table.HeadCell>
  <Table.HeadCell className='font-bold tracking-widest'>Event Name</Table.HeadCell>
  <Table.HeadCell ><ImLocation size={25}/></Table.HeadCell>
  
  <Table.HeadCell>
    <span>Delete </span></Table.HeadCell>
  <Table.HeadCell>
    <span>Edit</span></Table.HeadCell>
  </Table.Head>
  {userEvents.map((event)=>(
    <Table.Body className='divide-y'>
      <Table.Row  className='bg-white dark:border-gray-700 dark:bg-gray-800'>
        <Table.Cell>
          {new Date(event.date).toISOString().slice(0, 10)}
        </Table.Cell>
        <Table.Cell>
          {event.time}
        </Table.Cell>
        <Table.Cell className='flex justify-center items-center mt-3'>
          {event.tickets.length>0?event.tickets.length:'No tickets'}
        </Table.Cell>
        <Table.Cell>
          <Link to={`/event/${event.slug}`}>
            <img src={event.image}
           alt={event.title}
           className='w-20 h-10 object-cover bg-gray-500'/>
          </Link>
        </Table.Cell>
        <Table.Cell className='flex justify-center'>
          <Link    className='font-medium text-gray-900 dark:text-white'   to={`/event/${event.slug}`}>{event.title}</Link>
        </Table.Cell>
        <Table.Cell className=' text-zinc-400 font-bold'>
        {event.location}
        </Table.Cell>
        <Table.Cell>
        <span onClick={()=>{
          setShowModal(true);
          setEventIdToDelete(event._id);
        }} className='font-medium flex justify-center hover:opacity-90 text-red-500 opacity-70 hover:underline cursor-pointer'>
        <MdDelete  size={25}/>
        </span>
        </Table.Cell>
        <Table.Cell>
        <Link className="text-teal-500 opacity-80  flex justify-center hover:opacity-100  hover:underline" to={`/update/${event._id}`}>
        <span>
        <FaEdit size={24}/>
        </span>
        </Link>
        </Table.Cell>
      </Table.Row>
    </Table.Body>
  ))}
  </Table>
  {
    showMore&&(
   <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show more</button>
    )
  }
</>
      ):(<p>You have no Events yet !</p>)}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400' onClick={handleDeleteEvent}>
              Are you sure you want to delete this Event?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteEvent}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashEvents