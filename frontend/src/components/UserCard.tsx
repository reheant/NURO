import { Avatar } from '@nextui-org/react';
import React from 'react';

interface UserCardProps {
    firstName: string;
    lastName: string;
    sex: string;
    ethnicity: string;
    address: string;
}

const UserCard: React.FC<UserCardProps> = ({ firstName, lastName, sex, ethnicity, address }) => {
    return (
        <div className="flex flex-row align-center w-full max-w-xs rounded-lg overflow-hidden">
            <div className="w-1/4 h-100 flex flex-col justify-center align-center">
                <div><Avatar isBordered className='w-20 h-20 text-md ' radius="sm" src="https://i.pravatar.cc/150?u=a042581f4e29026024d" /></div>
            </div>
            <div className="w-1/4 p-4">
                <p className="text-xl font-bold mb-2">First Name: {firstName}</p>
                <p className="text-xl font-bold mb-2">Last Name: {lastName}</p>
                <p className="text-sm text-gray-500 mb-1">Sex: {sex}</p>
                <p className="text-sm text-gray-500 mb-1">Ethnicity: {ethnicity}</p>
                <p className="text-sm text-gray-500 break-words">Address: {address}</p>
            </div>
        </div>
    );
};

export default UserCard;
