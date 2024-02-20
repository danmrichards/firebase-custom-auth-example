import { useRouter } from 'next/router';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../AuthProvider';
export default () => {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const router = useRouter();
  const { login, status } = useAuth();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(email, password);
  };
  const handleChange = (func: Function) => (e: ChangeEvent<HTMLInputElement>) => {
    func(e.target.value);
  };
  useEffect(() => {
    if (status === 'authenticated') router.push('/protected');
  }, [status]);
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className='form_input'>
          <label>email</label>
          <input type='email' value={email} onChange={handleChange(setEmail)} />
        </div>
        <div className='form_input'>
          <label>password</label>
          <input type='password' value={password} onChange={handleChange(setPassWord)} />
        </div>
        <button>login</button>
      </form>
    </div>
  );
};