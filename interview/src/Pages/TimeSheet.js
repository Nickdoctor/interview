import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../Styles/TimeSheet.css';
import { supabase } from '../supabaseClient.js';
import TrashIcon from '../Assets/trash.svg';

function TimeSheetPage() {
    const navigate = useNavigate();
    const [rate, setRate] = useState("");
    const [description, setDescription] = useState("");
    const [lineItems, setLineItems] = useState([{ date: "", minutes: "" }]);
    const [loadedData, setLoadedData] = useState([]); // State to store loaded data

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (!session) {
                navigate('/AuthPage');
            } else {
                console.log('User is logged in:', session.user.email);
            }
        };
        checkAuth();
    }, []);

    const handleLineItemChange = (index, field, value) => {
        const updated = [...lineItems];
        updated[index][field] = value;
        setLineItems(updated);
    };

    const handleSave = async () => {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            console.error('Error fetching session:', sessionError);
            alert('You must be logged in to save data.');
            return;
        }

        const userId = session.user.id; // Get the logged-in user's ID

        const savedData = {
            userId: userId,
            lineItems, // Array of dates and hours
            totalTime: lineItems.reduce((sum, item) => sum + Number(item.minutes || 0), 0),
            rate, // Rate per hour
            description, // Description
            totalCost: lineItems.reduce((sum, item) => sum + Number(item.minutes || 0), 0) * Number(rate || 0) / 60,
        };

        const { data, error } = await supabase
            .from('timesheets')
            .insert([savedData]);

        if (error) {
            console.error('Error saving data:', error);
            alert('Failed to save data.');
        } else {
            console.log('Data saved:', data);
            alert('Data saved successfully!');
        }
        window.location.reload();
    };

    const handleLoad = async () => {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            console.error('Error fetching session:', sessionError);
            alert('You must be logged in to load data.');
            return;
        }

        const userId = session.user.id; // Get the logged-in user's ID
        const { data, error } = await supabase
            .from('timesheets')
            .select('*')
            .eq('userId', userId) // Filter by user ID
            .order('created_at', { ascending: false }); // Order by creation date

        if (error) {
            console.error('Error loading data:', error);
            alert('Failed to load data.');
        } else {
            console.log('Loaded data:', data);
            setLoadedData(data); // Update state with loaded data
        }
    };
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this record?");
        if (!confirmDelete) {
            return; // Exit the function if the user cancels
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
            console.error('Error fetching session:', sessionError);
            alert('You must be logged in to delete data.');
            return;
        }

        const { error } = await supabase
            .from('timesheets')
            .delete() // Delete the record
            .eq('id', id); // Filter by user ID

        if (error) {
            console.error('Error deleting data:', error);
            alert('Failed to delete data.');
        } else {
            alert('Record deleted successfully!');
            handleLoad(); // Reload the data after deletion
        }
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { date: "", minutes: "" }]);
    };

    const handleRemove = (index) => {
        const updated = [...lineItems];
        updated.splice(index, 1);
        setLineItems(updated);
    };

    const totalTime = lineItems.reduce((sum, item) => sum + Number(item.minutes || 0), 0);
    const totalCost = totalTime * Number(rate || 0) / 60;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4" style={{ paddingTop: '100px', paddingBottom: '100px' }}>
            <form className="p-4 bg-white rounded shadow hover-card container-md" style={{ maxWidth: '1000px' }}>
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600" style={{ paddingBottom: '25px' }}>Timesheet</h1>

                {/* Line Items */}
                <div class="row justify-content-center">
                    {lineItems.map((item, index) => (
                        <div key={index} className="mb-4 d-flex justify-content-center align-items-center gap-3" >
                            <input
                                type="date"
                                value={item.date}
                                onChange={(e) => {
                                    e.preventDefault();
                                    handleLineItemChange(index, "date", e.target.value);
                                }}
                                className="form-control w-auto"
                            />
                            <input
                                type="number"
                                value={item.minutes}
                                onChange={(e) => {
                                    e.preventDefault();
                                    handleLineItemChange(index, "minutes", e.target.value);
                                }}
                                className="form-control w-auto"
                                placeholder="Minutes"
                                min="0"
                            />
                            <img src={TrashIcon} alt="Trash Icon" width="24" height="24" onClick={() => handleRemove(index)} style={{ cursor: 'pointer' }} />
                        </div>
                    ))}
                </div>
                <div class="d-grid gap-2 col-6 mx-auto">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            addLineItem();
                        }}
                        class="btn btn-primary me-3 mb-4"
                    >
                        Add Day
                    </button>
                </div>

                {/* Rate */}
                <div className="row justify-content-center mb-4">
                    <div className="col-md-4">
                        <div className="form-floating mb-3">
                            <input type="number" class="form-control" id="floatingRate" placeholder="rate" htmlFor="floatingRate"
                                value={rate} onChange={(e) => {
                                    e.preventDefault();
                                    setRate(e.target.value);
                                }} />
                            <label htmlFor="floatingRate">Rate per hour</label>
                        </div>
                    </div>
                </div>

                {/* Totals/Des/Save */}
                <div className="d-flex justify-content-center gap-5 mb-4">
                    <div className="text-center">
                        <p className="fw-normal">
                            Total Time: <span className="font-bold">{totalTime} Minutes </span>
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="fw-normal">
                            Total Pay: <span className="font-bold">${totalCost.toFixed(2)}</span>
                        </p>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center mb-3">
                    <div className="col-md-4">
                        <textarea
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="flex-1 border rounded-lg p-2"
                            rows="5"
                            style={{ width: '300px' }}
                            min="0"
                        />
                    </div>
                </div>

                <div class="d-grid gap-2 col-6 mx-auto">
                    <button variant="primary" class="btn btn-primary me-3 mb-4"
                        onClick={(e) => {
                            e.preventDefault();
                            handleSave();
                        }}>
                        Save
                    </button>
                </div>


                {/* Load/Sign in and Out */}
                <div class="d-grid gap-2 col-6 mx-auto">
                    <button variant="primary" class="btn btn-primary me-3 mb-4"
                        onClick={(e) => {
                            e.preventDefault();
                            handleLoad();
                        }}>
                        Load Previous Data
                    </button>
                </div>
                <div class="d-grid gap-2 col-6 mx-auto">
                    <button variant="primary" class="btn btn-secondary me-3 mb-4"
                        onClick={(e) => {
                            e.preventDefault();
                            navigate('/AuthPage');
                        }}>
                        Sign In / Out
                    </button>
                </div>


                {/* Loaded Data */}
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Loaded Data</h2>
                    {Array.isArray(loadedData) && loadedData.length > 0 ? (
                        loadedData.map((item, index) => (
                            <div key={index} className="mb-6 p-4 border rounded-lg shadow" style={{ marginBottom: '20px' }}>
                                <h3 className="text-lg font-bold mb-2">Entry {index + 1}</h3>
                                {item.lineItems.map((lineItem, lineIndex) => (
                                    <div key={lineIndex} className="mb-4 p-4 border rounded-lg shadow bg-gray-50">
                                        <p><strong>Date:</strong> {lineItem.date}</p>
                                        <p><strong>Minutes:</strong> {lineItem.minutes}</p>
                                    </div>
                                ))}
                                <p><strong>Total Time:</strong> {item.totalTime} minutes</p>
                                <p><strong>Rate:</strong> ${item.rate} per hour</p>
                                <p><strong>Description:</strong> {item.description}</p>
                                <p><strong>Total Pay:</strong> ${item.totalCost.toFixed(2)}</p>
                                <div class="d-grid gap-2 col-6 mx-auto">
                                    <button variant="primary" class="btn btn-danger me-3 mb-4"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(item.id); // Pass the ID of the item to delete
                                        }}>
                                        Delete Record
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No data loaded yet.</p>
                    )}
                </div>
            </form>
        </div>
    );
}

export default TimeSheetPage;