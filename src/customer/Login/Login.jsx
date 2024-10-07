import Header from '../../components/Header/header';
import '../Login/Login.css';
import lk from '../../assets/logo/logo-giao-duc-an-nhien.png';
import { useState } from 'react';
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Email: ', email, 'Password', password);
    }
    return (
        <div className='login-container'>
            <Header />
            <div className='login-image'>
                <img src={lk} className='login-logo' />
            </div>
            <div className='login-box'>
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Mật khẩu</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">
                        Đăng nhập
                    </button>
                    <a href="#" className="forgot-password">
                        Quên mật khẩu?
                    </a>
                </form>
            </div>
        </div>
    )
}