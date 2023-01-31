import { useState } from "react";

const TweetModal = () => {
    const [showModal, setShowModal] = useState(true);
  
    return (
          <div className="fixed inset-0 p-4 flex items-center justify-center bg-gray-200">
            <div className="bg-white rounded p-4">
              <h3 className="text-lg font-bold">Modal Title</h3>
              <p className="my-4">Modal content goes here</p>
              <button className="bg-red-500 text-white p-2 rounded" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>

    );
  };

  export default TweetModal;