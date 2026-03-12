import * as React from 'react';
import FormContainer from '../FormContainer/FormContainer';
import type { UrlData } from '../../interface/UrlData';
import axios from 'axios';
import { serverUrl } from '../../helpers/Constants';
import DataTable from '../DataTable/DataTable';
import { useNavigate } from 'react-router-dom';
interface IContainerProps {}

const Container: React.FunctionComponent<IContainerProps> = () => {
  const [data, setData] = React.useState<UrlData[]>([]);
  const  [reload, setReload] = React.useState<boolean>(false);
  const navigate = useNavigate();

  const updateReloadState = (): void => {
    setReload(true);
  };

  //fetching the data altogether
  // const fetchTableData = async () => {
  //   const response= await axios.get(`${serverUrl}/shortUrl`);
  //   console.log("The response from server is : ", response);
  //   setData(response.data);
  //   setReload(false);
  // };

  // const token = localStorage.getItem('token');
  // if(!token){
  //   return(
  //     <div>Please Login first</div> 
  //   )     
    
  // }
  React.useEffect(() => {
    const token = localStorage.getItem("token");

    if(!token){
      navigate("/login");
    }
  }, []);

  const fetchTableData = async () => {
    
    try{

      const response = await axios.get(
        `${serverUrl}/short/shortUrl/myurls`,
        {
          headers:{
            Authorization:`Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      console.log("The response from server is : ", response);

      setData(response.data);
      setReload(false);
    }catch(error){
      console.log(error);
    }

  };
  
  React.useEffect(() => {
    fetchTableData();
  }, [reload]);

  React.useEffect(() =>{
    const handleFocus = () =>{
      fetchTableData();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  return (
    <>
      <FormContainer updateReloadState={updateReloadState} />
      <DataTable updateReloadState={updateReloadState} data={data}/> 
    </>
  );
};

export default Container;
