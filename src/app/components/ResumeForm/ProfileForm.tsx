import { BaseForm } from "components/ResumeForm/Form";
import {
  Input,
  Textarea,
  InputGroupWrapper,
  INPUT_CLASS_NAME,
} from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changeProfile, selectProfile } from "lib/redux/resumeSlice";
import { ResumeProfile } from "lib/redux/types";
import { useCallback } from "react";
import Image from "next/image";

export const ProfileForm = () => {
  const profile = useAppSelector(selectProfile);
  const dispatch = useAppDispatch();
  const {
    name,
    email,
    phone,
    url,
    summary,
    location,
    experienceYears,
    photoDataUrl,
    publicSlug,
  } = profile;

  const handleProfileChange = useCallback(
    (field: keyof ResumeProfile, value: string) => {
      dispatch(changeProfile({ field, value }));
    },
    [dispatch]
  );

  const handlePhotoUpload = useCallback(
    (file?: File | null) => {
      if (!file) {
        handleProfileChange("photoDataUrl", "");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        handleProfileChange("photoDataUrl", event.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    [handleProfileChange]
  );

  return (
    <BaseForm>
      <div className="grid grid-cols-6 gap-3">
        <Input
          label="Name"
          labelClassName="col-span-full"
          name="name"
          placeholder="Sal Khan"
          value={name}
          onChange={handleProfileChange}
        />
        <Input
          label="Years of Experience"
          labelClassName="col-span-2"
          name="experienceYears"
          placeholder="10"
          value={experienceYears ?? ""}
          onChange={handleProfileChange}
        />
        <Textarea
          label="Objective"
          labelClassName="col-span-full"
          name="summary"
          placeholder="Entrepreneur and educator obsessed with making education free for anyone"
          value={summary}
          onChange={handleProfileChange}
        />
        <Input
          label="Email"
          labelClassName="col-span-4"
          name="email"
          placeholder="hello@khanacademy.org"
          value={email}
          onChange={handleProfileChange}
        />
        <Input
          label="Phone"
          labelClassName="col-span-2"
          name="phone"
          placeholder="(123)456-7890"
          value={phone}
          onChange={handleProfileChange}
        />
        <Input
          label="Website"
          labelClassName="col-span-4"
          name="url"
          placeholder="linkedin.com/in/khanacademy"
          value={url}
          onChange={handleProfileChange}
        />
        <Input
          label="Location"
          labelClassName="col-span-2"
          name="location"
          placeholder="NYC, NY"
          value={location}
          onChange={handleProfileChange}
        />
        <Input
          label="Public Profile Handle"
          labelClassName="col-span-3"
          name="publicSlug"
          placeholder="sal-khan"
          value={publicSlug ?? ""}
          onChange={handleProfileChange}
        />
        <div className="col-span-3 flex flex-col gap-2">
          <InputGroupWrapper label="Profile Photo">
            <input
              type="file"
              accept="image/*"
              className={`${INPUT_CLASS_NAME} cursor-pointer`}
              onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
            />
          </InputGroupWrapper>
          {photoDataUrl && (
            <div className="relative mt-2 flex items-center gap-3">
              <Image
                src={photoDataUrl}
                alt="Profile preview"
                width={80}
                height={80}
                className="h-20 w-20 rounded-full object-cover"
                unoptimized
              />
              <button
                type="button"
                className="text-sm font-semibold text-rose-600"
                onClick={() => handlePhotoUpload(null)}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </BaseForm>
  );
};
