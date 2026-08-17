import React, { useState } from 'react';
import AuthInputField from '../auth/AuthInputField';
import AuthButton from '../auth/AuthButton';

interface ProfileData {
  name: string;
  age: number | '';
  gender: string;
  height: number | ''; // cm
  weight: number | ''; // kg
  activityLevel: string;
  healthGoal: string;
}

interface ProfileFormProps {
  initialData: ProfileData;
  onSubmit: (data: ProfileData) => Promise<void>;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProfileData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Edit Profile</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AuthInputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <AuthInputField
          label="Age"
          name="age"
          type="number"
          min="1"
          max="120"
          value={formData.age}
          onChange={handleChange}
        />
        
        <div className="flex flex-col space-y-1 mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <AuthInputField
          label="Height (cm)"
          name="height"
          type="number"
          min="1"
          value={formData.height}
          onChange={handleChange}
        />
        
        <AuthInputField
          label="Weight (kg)"
          name="weight"
          type="number"
          min="1"
          value={formData.weight}
          onChange={handleChange}
        />

        <div className="flex flex-col space-y-1 mb-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Activity Level</label>
          <select
            name="activityLevel"
            value={formData.activityLevel}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
            <option value="Extra Active">Extra Active</option>
          </select>
        </div>
        
        <div className="flex flex-col space-y-1 mb-4 md:col-span-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Health Goal</label>
          <select
            name="healthGoal"
            value={formData.healthGoal}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="Maintenance">Maintenance</option>
            <option value="Weight loss">Weight loss</option>
            <option value="Weight gain">Weight gain</option>
            <option value="Muscle gain">Muscle gain</option>
          </select>
        </div>
      </div>

      <div className="flex space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-all duration-200"
          disabled={isLoading}
        >
          Cancel
        </button>
        <AuthButton type="submit" isLoading={isLoading} className="flex-1">
          Save Profile
        </AuthButton>
      </div>
    </form>
  );
};

export default ProfileForm;
