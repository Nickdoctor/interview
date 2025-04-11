import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import '../Styles/TimeSheet.css';
import { supabase } from '../supabaseClient.js';

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

    const handleNavigation = (path) => {
        return () => navigate(path);
    };

    const addLineItem = () => {
        setLineItems([...lineItems, { date: "", minutes: "" }]);
    };

    const totalTime = lineItems.reduce((sum, item) => sum + Number(item.minutes || 0), 0);
    const totalCost = totalTime * Number(rate || 0) / 60;

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Timesheet</h1>

                {/* Line Items */}
                {lineItems.map((item, index) => (
                    <div key={index} className="mb-4 flex gap-4">
                        <input
                            type="date"
                            value={item.date}
                            onChange={(e) => handleLineItemChange(index, "date", e.target.value)}
                            className="flex-1 border rounded-lg p-2"
                        />
                        <input
                            type="number"
                            value={item.minutes}
                            onChange={(e) => handleLineItemChange(index, "minutes", e.target.value)}
                            className="flex-1 border rounded-lg p-2"
                            placeholder="Minutes"
                            min="0"
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addLineItem}
                    className="mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Add Day
                </button>

                {/* Rate */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rate ($ Per Hour)</label>
                    <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="w-full border rounded-lg p-2"
                        placeholder="Enter rate"
                        min="0"
                    />
                </div>

                {/* Totals */}
                <div className="mt-6 border-t pt-4">
                    <div className="text-lg font-medium text-gray-700">
                        Total Time Worked: <span className="font-bold">{totalTime} Minutes </span>
                    </div>
                    <div className="text-lg font-medium text-gray-700">
                        Total Pay: <span className="font-bold">${totalCost.toFixed(2)}</span>
                    </div>
                    <textarea
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex-1 border rounded-lg p-2"
                        min="0"
                    />
                    <div>
                        <Button variant="primary" className="mt-4" onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                    <div>
                        <Button variant="primary" className="mt-4" onClick={handleLoad}>
                            Load Previous Data
                        </Button>
                    </div>
                    <div>
                        <Button variant="primary" className="mt-4" onClick={handleNavigation('/AuthPage')}>
                            Sign In / Out
                        </Button>
                    </div>
                </div>

                {/* Loaded Data */}
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Loaded Data</h2>
                    {loadedData.length > 0 ? (
                        loadedData.map((item, index) => (
                            <div key={index} className="mb-6 p-4 border rounded-lg shadow">
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
                            </div>
                        ))
                    ) : (
                        <p>No data loaded yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default TimeSheetPage;