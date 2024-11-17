import React from 'react';

const MembershipStatus = () => {
  return (
    <div className="bg-[#F6F2E9] p-6 rounded-lg w-3/5">
      <h2 className="text-[20px] text-black font-bold text-decoration-line: underline  mb-4">Membership Status:</h2>
      <div className="flex flex-col gap-4">
        <span className="text-center inline-block bg-green-500 text-black w-2/5 font-bold py-2 px-4 rounded-2xl">
          Amplify LatinX+ Member 💎
        </span>
        <button className="bg-red-600 text-black font-bold  w-2/5 px-4 py-2 rounded-2xl hover:bg-red-700">
          Cancel Membership
        </button>
      </div>
    </div>
  );
};

export default MembershipStatus;
