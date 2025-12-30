import { useState } from 'react';
import { signUp } from '../services/authService';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSingUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      toast.success('Registered successfully!');
      navigate('/my-travels');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='signup-page'>
        <form className='signup-form' onSubmit={handleSingUp}>
        <h1>Register</h1>

        <label>Email</label>
        <input
            type="email"
            className='form-control'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
            type="password"
            className='form-control'
            placeholder='Create your password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className='btn'>Sign up</button>

        <p className='text-center'>
          Already have an account? <Link to='/login'>Log in here</Link>
        </p>

        </form>
    </div>
  );
}

export default SignUp;