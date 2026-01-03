import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { IconArrowLeft, IconCheck, IconLoader } from '@tabler/icons-react'
import { useAppStore } from '../store/useAppStore'
import Input from '../components/common/Input'
import Textarea from '../components/common/Textarea'
import Button from '../components/common/Button'
import { LogoUploader } from '../components/business/LogoUploader'
import {
    validateBusinessName,
    validatePhone,
    validateDescription,
    validateBusinessProfile,
    isValidForm,
} from '../utils/validators'

export default function CreateProfile() {
    const navigate = useNavigate()
    const { id } = useParams()
    const isEditing = Boolean(id)

    const {
        businesses,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        showToast,
    } = useAppStore()

    // Find existing business if editing
    const existingBusiness = isEditing
        ? businesses.find((b) => b.id === id)
        : null

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        description: '',
        logo: null,
    })
    const [errors, setErrors] = useState({})
    const [logoError, setLogoError] = useState(null)
    const [isSaving, setIsSaving] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Initialize form with existing data
    useEffect(() => {
        if (existingBusiness) {
            setFormData({
                name: existingBusiness.name || '',
                phone: existingBusiness.phone?.replace('+91', '') || '',
                description: existingBusiness.description || '',
                logo: existingBusiness.logo || null,
            })
        }
    }, [existingBusiness])

    // Track changes
    useEffect(() => {
        if (isEditing && existingBusiness) {
            const changed =
                formData.name !== existingBusiness.name ||
                formData.phone !== existingBusiness.phone?.replace('+91', '') ||
                formData.description !== existingBusiness.description ||
                formData.logo !== existingBusiness.logo
            setHasChanges(changed)
        } else {
            setHasChanges(
                formData.name.trim() !== '' ||
                formData.phone.trim() !== '' ||
                formData.description.trim() !== '' ||
                formData.logo !== null
            )
        }
    }, [formData, isEditing, existingBusiness])

    // Handle input changes
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error on change
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }))
        }
    }

    // Handle input blur (validate on blur)
    const handleBlur = (field) => {
        let error = null
        switch (field) {
            case 'name':
                error = validateBusinessName(formData.name)
                break
            case 'phone':
                error = validatePhone(formData.phone)
                break
            case 'description':
                error = validateDescription(formData.description)
                break
            default:
                break
        }
        if (error) {
            setErrors((prev) => ({ ...prev, [field]: error }))
        }
    }

    // Handle logo change
    const handleLogoChange = (logoData, error) => {
        setFormData((prev) => ({ ...prev, logo: logoData }))
        setLogoError(error)
    }

    // Check if form is valid
    const isFormValid = () => {
        const validationErrors = validateBusinessProfile(formData)
        return isValidForm(validationErrors) && !logoError
    }

    // Handle save
    const handleSave = async () => {
        // Validate all fields
        const validationErrors = validateBusinessProfile(formData)
        if (!isValidForm(validationErrors)) {
            setErrors(validationErrors)
            showToast('Please fix the errors and try again', 'error')
            return
        }

        setIsSaving(true)

        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500))

            const profileData = {
                name: formData.name.trim(),
                phone: `+91${formData.phone}`,
                description: formData.description.trim(),
                logo: formData.logo,
                updatedAt: new Date().toISOString(),
            }

            if (isEditing) {
                updateBusiness(id, profileData)
                showToast('Profile updated successfully!', 'success')
            } else {
                addBusiness({
                    ...profileData,
                    createdAt: new Date().toISOString(),
                })
                showToast('Profile created successfully!', 'success')
            }

            navigate('/')
        } catch (error) {
            console.error('Save failed:', error)
            showToast('Failed to save profile. Please try again.', 'error')
        } finally {
            setIsSaving(false)
        }
    }

    // Handle back
    const handleBack = () => {
        if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to go back?')) {
                navigate(-1)
            }
        } else {
            navigate(-1)
        }
    }

    // Handle delete
    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this business profile?')) {
            deleteBusiness(id)
            showToast('Profile deleted', 'success')
            navigate('/')
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between h-14">
                {/* Back button */}
                <button
                    onClick={handleBack}
                    className="w-10 h-10 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 flex items-center justify-center transition-colors duration-200"
                    aria-label="Go back"
                >
                    <IconArrowLeft size={20} className="text-neutral-600" />
                </button>

                {/* Title */}
                <h1 className="text-lg font-semibold text-neutral-900 absolute left-1/2 transform -translate-x-1/2">
                    {isEditing ? 'Edit Profile' : 'Create Profile'}
                </h1>

                {/* Save button */}
                <button
                    onClick={handleSave}
                    disabled={!isFormValid() || isSaving}
                    className="w-10 h-10 rounded-lg hover:bg-neutral-100 active:bg-neutral-200 flex items-center justify-center transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Save profile"
                >
                    {isSaving ? (
                        <IconLoader size={20} className="text-primary-orange animate-spin" />
                    ) : (
                        <IconCheck size={20} className="text-primary-orange" />
                    )}
                </button>
            </header>

            {/* Form Content */}
            <main className="p-4 pb-32 space-y-6">
                {/* Logo Upload */}
                <section className="bg-white rounded-xl p-6 border border-neutral-200">
                    <LogoUploader
                        value={formData.logo}
                        onChange={handleLogoChange}
                        error={logoError}
                    />
                </section>

                {/* Business Details */}
                <section className="bg-white rounded-xl p-6 border border-neutral-200 space-y-5">
                    {/* Business Name */}
                    <Input
                        id="business-name"
                        label="Business Name"
                        required
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        onBlur={() => handleBlur('name')}
                        error={errors.name}
                        helperText="This will appear on all your festival cards"
                        placeholder="e.g., Tejaswini Gold Shop"
                        maxLength={50}
                    />

                    {/* Phone Number */}
                    <Input
                        id="phone"
                        label="Phone Number"
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                            handleChange('phone', value)
                        }}
                        onBlur={() => handleBlur('phone')}
                        error={errors.phone}
                        helperText="Customers can call you directly from the card"
                        placeholder="9866337106"
                        leftElement={<span className="font-medium text-neutral-600">+91</span>}
                        maxLength={10}
                    />

                    {/* Description */}
                    <Textarea
                        id="description"
                        label="Short Description"
                        required
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        onBlur={() => handleBlur('description')}
                        error={errors.description}
                        helperText="Briefly describe your business"
                        placeholder="e.g., Traditional gold jewelry for all occasions"
                        rows={3}
                        maxLength={60}
                        showCharCount
                    />
                </section>

                {/* Delete Button (only when editing) */}
                {isEditing && (
                    <section className="pt-4">
                        <button
                            onClick={handleDelete}
                            className="w-full text-center text-error font-medium py-3 rounded-lg hover:bg-error/5 transition-colors"
                        >
                            Delete Business Profile
                        </button>
                    </section>
                )}
            </main>

            {/* Sticky Save Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 safe-area-inset-bottom">
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleSave}
                    disabled={!isFormValid()}
                    loading={isSaving}
                >
                    {isEditing ? 'Update Profile' : 'Save Business Profile'}
                </Button>
            </div>
        </div>
    )
}
