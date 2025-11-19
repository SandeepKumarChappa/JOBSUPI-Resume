import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
  InputGroupWrapper,
  INPUT_CLASS_NAME,
} from "components/ResumeForm/Form/InputGroup";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { changePortfolio, selectPortfolio } from "lib/redux/resumeSlice";

const mediaOptions = [
  { value: "link", label: "Link" },
  { value: "image", label: "Photo" },
  { value: "video", label: "Video" },
];

export const PortfolioForm = () => {
  const portfolioItems = useAppSelector(selectPortfolio);
  const dispatch = useAppDispatch();
  const showDelete = portfolioItems.length > 1;

  return (
    <Form form="portfolio" addButtonText="Add Portfolio Item">
      {portfolioItems.map((item, idx) => {
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== portfolioItems.length - 1;

        const handleChange = (
          field:
            | "title"
            | "url"
            | "mediaType"
            | "thumbnail"
            | "descriptions",
          value: string | string[]
        ) => {
          dispatch(
            changePortfolio({
              idx,
              field,
              value,
            })
          );
        };

        return (
          <FormSection
            key={`${item.title}-${idx}`}
            form="portfolio"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText="Remove portfolio item"
          >
            <Input
              name="title"
              label="Portfolio Title"
              placeholder="E-commerce case study"
              value={item.title}
              onChange={(_, value) => handleChange("title", value)}
              labelClassName="col-span-4"
            />
            <Input
              name="url"
              label="URL"
              placeholder="https://example.com/demo"
              value={item.url}
              onChange={(_, value) => handleChange("url", value)}
              labelClassName="col-span-2"
            />
            <InputGroupWrapper label="Media Type" className="col-span-2">
              <select
                className={`${INPUT_CLASS_NAME} capitalize`}
                value={item.mediaType}
                onChange={(e) => handleChange("mediaType", e.target.value)}
              >
                {mediaOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </InputGroupWrapper>
            <Input
              name="thumbnail"
              label="Thumbnail URL (optional)"
              placeholder="https://images.example.com/preview.jpg"
              value={item.thumbnail ?? ""}
              onChange={(_, value) => handleChange("thumbnail", value)}
              labelClassName="col-span-4"
            />
            <BulletListTextarea
              name="descriptions"
              label="Highlights"
              placeholder="What should recruiters notice?"
              value={item.descriptions}
              onChange={(_, value) => handleChange("descriptions", value)}
              labelClassName="col-span-full"
              showBulletPoints={false}
            />
          </FormSection>
        );
      })}
    </Form>
  );
};


