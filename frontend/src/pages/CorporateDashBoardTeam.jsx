import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import AddIcon from '@mui/icons-material/Add';
import Select from 'react-select';

const CorporateDashBoardTeam = () => {
    const axiosPrivate = useAxiosPrivate()
    const location = useLocation();
    const teamId = location.pathname.split("/")[2];
    const [team, setTeam] = useState()
    const [teamUpdated, setTeamUpdated] = useState(false)
    const [courseId, setCourseId] = useState()
    const [trainees, setTrainees] = useState()
    const [selectedTrainees, setSelectedTrainees] = useState()
    const [showTraineesForm, setShowTraineesForm] = useState(false)
    const [showCourseForm, setShowCourseForm] = useState(false)

    useEffect(() => {
        const getTeam = async () => {
            try {
                const res = await axiosPrivate.get(`/teams/${teamId}`);
                setTeam(res.data);
            } catch (error) {
                console.error(error);
            }
        };
        getTeam();
    }, [teamUpdated]);

    useEffect(() => {
        const getCorporate = async () => {
            try {
                const res = await axiosPrivate.get(`/corporates/trainees`);
                setTrainees(res.data.trainees)
            } catch (error) {
                console.error(error);
            }
        };
        getCorporate();
    }, []);

    const handleTraineeChange = (selectedOptions) => {
        const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedTrainees(values);
    };

    const addTrainees = async () => {
        try {

            const response = await axiosPrivate.post(`/teams/${teamId}/trainees`, { traineeIds: selectedTrainees });
            console.log(response.data);
            setTeamUpdated(!teamUpdated)
            setShowTraineesForm(false)
            setSelectedTrainees([])
        } catch (error) {
            console.error('Failed to update course', error);
        }
    };

    const addCourse = async () => {
        try {

            const response = await axiosPrivate.post(`/teams/${teamId}/courses/${courseId}`);
            console.log(response.data);
            setTeamUpdated(!teamUpdated)
            setShowCourseForm(false)
            setCourseId(null)
        } catch (error) {
            console.error('Failed to update course', error);
        }
    };

    return (
        <main>
            <div class="contact">
                <div class="row">
                    <div class="col-lg-8" id="mainContent">
                        <div class="row box first">
                            <div class="box-header">
                                <div className="flex-row">
                                    <h3><strong>1</strong>Trainees</h3>
                                    <div className="add-input">
                                        <AddIcon></AddIcon>
                                        <button className='add-more' onClick={() => setShowTraineesForm(true)}>Add Trainees </button>
                                    </div>
                                </div>
                                <p>Add or remove trainees from here.</p>
                            </div>
                            {showTraineesForm &&
                                <>
                                    <div class="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <Select
                                                isMulti
                                                class="wide"
                                                placeholder="Course Category"
                                                options={trainees?.map((t) => ({
                                                    value: t._id,
                                                    label: t.email,
                                                }))}
                                                name="subject"
                                                value={
                                                    selectedTrainees?.map((id) => {
                                                        const trainee = trainees.find((t) => t._id === id);
                                                        return { value: trainee?._id, label: trainee?.email };
                                                    }) || []
                                                }
                                                onChange={handleTraineeChange} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <button className="btn-05" onClick={addTrainees}>save</button>
                                        </div>
                                    </div>
                                </>
                            }
                            <div class="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title overflow-hidden">trainees</h4>
                                        <div className="table-responsive">
                                            <table className="table table-centered table-hover table-xl mb-0" id="recent-orders">
                                                <thead>
                                                    <tr>
                                                        <th><h4>Name</h4></th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {team?.trainees && team?.trainees.map((trainee, index) => {
                                                        return (
                                                            <tr
                                                                key={index}

                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <td><h5>{trainee.firstName}  {trainee.lastName}</h5></td>

                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                            {team?.trainees?.length === 0 && <div className='no-data'>There is no Trainees</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row box">
                            <div class="box-header">
                                <div className="flex-row">
                                    <h3><strong>1</strong>Courses</h3>
                                    <div className="add-input">
                                        <AddIcon></AddIcon>
                                        <button className='add-more' onClick={() => setShowCourseForm(true)}>Add Course </button>
                                    </div>
                                </div>
                                <p> Assign or remove courses from here.</p>
                            </div>
                            {showCourseForm &&
                                <>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <input className="form-control" placeholder='Enter Course ID' value={courseId} onChange={(e) => setCourseId(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="col-lg-6 col-md-6">
                                        <div className="form-group">
                                            <button className="btn-05" onClick={addCourse}>save</button>
                                        </div>
                                    </div>
                                </>
                            }
                            <div class="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title overflow-hidden">Courses</h4>
                                        <div className="table-responsive">
                                            <table className="table table-centered table-hover table-xl mb-0" id="recent-orders">
                                                <thead>
                                                    <tr>
                                                        <th><h4>Title</h4></th>

                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {team?.courses && team?.courses.map((course, index) => {
                                                        return (
                                                            <tr
                                                                key={index}

                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <td><h5>{course.title}</h5></td>

                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                            {team?.courses?.length === 0 && <div className='no-data'>There is no teams</div>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    {/* <div class="col-lg-4" id="sidebar">
                        <div id="contactInfoContainer" class="theiaStickySidebar">
                            <div class="contact-box">
                                <h2 className={unSavedChanges > 0 ? 'error' : ''}>{unSavedChanges > 0 && <FiberManualRecordIcon />} {unSavedChanges} Unsaved Changes</h2>
                                <button className={unSavedChanges > 0 ? 'btn-05' : 'btn-06'} onClick={saveCourse}>Save</button>
                            </div>
                            <div class="contact-box">
                                <i class="icon icon-envelope"></i>
                                <h2>{lessons.length} Lessons Created</h2>
                                <a>Click them to complete</a>
                            </div>
                            <div class="contact-box">
                                <h2>Publish Your Course</h2>
                                <a>Complete Landing page and all lessons content then publish your course</a>
                                <button className='btn-05' onClick={publish}>Publish</button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </main>
    )
}

export default CorporateDashBoardTeam