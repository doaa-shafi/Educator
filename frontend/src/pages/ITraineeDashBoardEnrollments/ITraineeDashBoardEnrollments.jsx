import React ,{useState,useEffect}from 'react'
import EnrollmentCard from '../../components/EnrollmentCard/EnrollmentCard';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import ITraineeDashBoardSideMenue from '../../components/ITraineeDashBoardSideMenue/ITraineeDashBoardSideMenue';

const ITraineeDashBoardEnrollments = () => {
  const axiosPrivate = useAxiosPrivate()
  const [enrollments, setEnrollments] = useState([]);
  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
    console.log('oooooooooooooo')

        const response = await axiosPrivate.get(`/enrollments/about`);
    console.log('oooooooooooooo')

        setEnrollments(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    };

    fetchEnrollments();
  }, []);
  return (
    <div className='instructor-dashboard-main-container'>
      <div className="instructor-dashboard-container">
        <ITraineeDashBoardSideMenue></ITraineeDashBoardSideMenue>
        <div>
          {enrollments.map((enrollment) => (
            <EnrollmentCard key={enrollment._id} enrollment={enrollment} />
          ))}
        </div>

      </div>

    </div>


  )
}

export default ITraineeDashBoardEnrollments