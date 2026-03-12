import { Link } from 'react-router-dom'
function Home() {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gray-100'>
        <div className='bg-white shadow-lg rounded-xl p-10 text-center max-w-md'>
            <h1 className='text-4xl font-bold mb-4 text-blue-600'>🔗 URL Shortener</h1>
            <p className='text-gray-600 mb-2'>Shorten your long links easily</p>
            <p className='text-gray-600 mb-2'>Track click analytics</p>
            <p className='text-gray-600 mb-6'>Manage your URLs</p>
        
            <div className='flex gap-4 justify-center'>
                <Link to="/login"><button className='bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition'>Login</button></Link>
                <Link to="/register"><button className='bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition'>Register</button></Link>
            </div>
    
        </div>
    </div>
  )
}

export default Home;