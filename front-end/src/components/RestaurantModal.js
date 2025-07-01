import React from 'react';
import { useForm } from 'react-hook-form';
import { X, Building2, Loader2 } from 'lucide-react';

const RestaurantModal = ({ isOpen, onClose, onSave, restaurant }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: restaurant || {
      restaurantName: '',
      restaurantLocation: '',
      restaurantEmail: '',
      restaurantPhoneNumber: '',
      restaurantDescription: '',
      restaurantAddress: '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(restaurant || {
        restaurantName: '',
        restaurantLocation: '',
        restaurantEmail: '',
        restaurantPhoneNumber: '',
        restaurantDescription: '',
        restaurantAddress: '',
      });
    }
  }, [isOpen, restaurant, reset]);

  const onSubmit = async (data) => {
    await onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Building2 className="h-6 w-6 text-primary-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  {restaurant ? 'Edit Restaurant' : 'Add Restaurant'}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="form-group">
                <label htmlFor="restaurantName" className="form-label">
                  Restaurant Name
                </label>
                <input
                  id="restaurantName"
                  type="text"
                  className={`input ${errors.restaurantName ? 'border-error-300 focus:ring-error-500' : ''}`}
                  placeholder="Enter restaurant name"
                  {...register('restaurantName', {
                    required: 'Restaurant name is required',
                    minLength: {
                      value: 3,
                      message: 'Restaurant name must be at least 3 characters',
                    },
                  })}
                />
                {errors.restaurantName && (
                  <p className="form-error">{errors.restaurantName.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="restaurantLocation" className="form-label">
                  Location
                </label>
                <input
                  id="restaurantLocation"
                  type="text"
                  className={`input ${errors.restaurantLocation ? 'border-error-300 focus:ring-error-500' : ''}`}
                  placeholder="Enter location"
                  {...register('restaurantLocation', {
                    required: 'Location is required',
                    minLength: {
                      value: 2,
                      message: 'Location must be at least 2 characters',
                    },
                  })}
                />
                {errors.restaurantLocation && (
                  <p className="form-error">{errors.restaurantLocation.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="restaurantEmail" className="form-label">
                  Email
                </label>
                <input
                  id="restaurantEmail"
                  type="email"
                  className={`input ${errors.restaurantEmail ? 'border-error-300 focus:ring-error-500' : ''}`}
                  placeholder="Enter email address"
                  {...register('restaurantEmail', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                />
                {errors.restaurantEmail && (
                  <p className="form-error">{errors.restaurantEmail.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="restaurantPhoneNumber" className="form-label">
                  Phone Number
                </label>
                <input
                  id="restaurantPhoneNumber"
                  type="tel"
                  className={`input ${errors.restaurantPhoneNumber ? 'border-error-300 focus:ring-error-500' : ''}`}
                  placeholder="Enter phone number"
                  {...register('restaurantPhoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: 'Phone number must be exactly 10 digits',
                    },
                  })}
                />
                {errors.restaurantPhoneNumber && (
                  <p className="form-error">{errors.restaurantPhoneNumber.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="restaurantDescription" className="form-label">
                  Description
                </label>
                <textarea
                  id="restaurantDescription"
                  rows={3}
                  className={`input ${errors.restaurantDescription ? 'border-error-300 focus:ring-error-500' : ''}`}
                  placeholder="Enter restaurant description"
                  {...register('restaurantDescription', {
                    required: 'Description is required',
                    minLength: {
                      value: 5,
                      message: 'Description must be at least 5 characters',
                    },
                  })}
                />
                {errors.restaurantDescription && (
                  <p className="form-error">{errors.restaurantDescription.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="restaurantAddress" className="form-label">
                  Address
                </label>
                <textarea
                  id="restaurantAddress"
                  rows={2}
                  className={`input ${errors.restaurantAddress ? 'border-error-300 focus:ring-error-500' : ''}`}
                  placeholder="Enter full address"
                  {...register('restaurantAddress', {
                    required: 'Address is required',
                    minLength: {
                      value: 5,
                      message: 'Address must be at least 5 characters',
                    },
                  })}
                />
                {errors.restaurantAddress && (
                  <p className="form-error">{errors.restaurantAddress.message}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex items-center"
                >
                  <Loader2 className="animate-spin h-4 w-4 mr-2 hidden" />
                  {restaurant ? 'Update Restaurant' : 'Add Restaurant'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantModal; 