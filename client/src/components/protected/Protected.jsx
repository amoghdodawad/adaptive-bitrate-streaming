import { Navigate } from "react-router-dom";
// import toast from "react-hot-toast";
import { useSelector } from "react-redux";
function Protected({ children, next }){
  const { token } = useSelector(store => store.user);
  if (!token) {
    // toast.error('Please signup/login to upload videos', { duration: 5000 });
    return <Navigate to={{
      pathname : '/login',
      search : '?next='+next
    }} replace/>;
  }
  return children;
};
export default Protected;