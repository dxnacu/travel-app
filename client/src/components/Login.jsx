import { useState } from 'react';
import { login } from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/loginSignup.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Login successful!');
      navigate('/my-travels');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    // <div className='login-wrapper'>
    //     <form className='login-form' onSubmit={handleSubmit}>
    //     <h2>Login</h2>

    //     <div className='mb-3'>
    //         <label>Email</label>
    //         <input
    //             type="email"
    //             className='form-control'
    //             placeholder='Enter your email'
    //             value={email}
    //             onChange={(e) => setEmail(e.target.value)}
    //         />
    //     </div>

    //     <div className='mb-3'>
    //         <label>Password</label>
    //         <input
    //             type="password"
    //             className='form-control'
    //             placeholder='Enter your password'
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //         />
    //     </div>

    //     <div className='d-grid'>
    //         <button type="submit" className='btn btn-primary'>
    //             Sign in
    //         </button>
    //     </div>
    //     <p className='text-right mt-2'>
    //         Don't have an account? <Link to='/register'>Register here</Link>
    //     </p>

    //     </form>
    // </div>

    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        <label>Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="btn">Sign in</button>

        <p className="text-center">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;