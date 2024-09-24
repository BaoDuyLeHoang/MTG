
import './HomePage.css';

export default function HomePage() {
    return (
        <div className="home-page">
            <aside className="sidebar">
                <Sidebar />
            </aside>
            <div className='dashboard'>
                <div className='stats'>
                    <div className='stat'>
                        <p>Employees</p>
                        <p>20</p>
                    </div>
                    <div className='stat'>
                        <p>Clients</p>
                        <p>20</p>
                    </div>
                    <div className='stat'>
                        <p>Orders</p>
                        <p>20</p>
                    </div>
                    <div className='stat'>
                        <p>Grave</p>
                        <p>20</p>
                    </div>
                </div>
                <div className='filters'>
                    <input type="date" />
                    <input type="date" />
                </div>
                <div className='charts'>
                    <div className='chart'>
                        <p>Pie Chart</p>
                    </div>
                    <div className='chart'>
                        <p>Bar Chart</p>
                    </div>
                    <div className='chart'>
                        <p>Line Chart</p>
                    </div>
                </div>
            </div>
        </div>
    )
}