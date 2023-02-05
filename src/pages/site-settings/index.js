import {
  AdvantageInput,
  HeroInput,
  OfferingInput,
  ReviewInput,
} from '@/components/Input/SiteSettings';
import { useMainContent, useUpdateMainContent } from '@/hooks/mainContent';
import { Accordion, AccordionTab } from 'primereact/accordion';

function SiteSettings() {
  const { data } = useMainContent();
  const { mutate: updateContent } = useUpdateMainContent();

  const handleUpdate = newContent => {
    updateContent(newContent);
  };

  return (
    <Accordion activeIndex={0}>
      <AccordionTab header="Hero">
        <HeroInput data={data?.['1']} onUpdate={handleUpdate} />
      </AccordionTab>
      <AccordionTab header="Advantage-1">
        <AdvantageInput data={data} onUpdate={handleUpdate} />
      </AccordionTab>
      <AccordionTab header="Advantage-2x">
        <AdvantageInput data={data} onUpdate={handleUpdate} />
      </AccordionTab>
      <AccordionTab header="Offers">
        <OfferingInput data={data} onUpdate={handleUpdate} />
      </AccordionTab>
      <AccordionTab header="Reviews">
        <ReviewInput data={data} onUpdate={handleUpdate} />
      </AccordionTab>
    </Accordion>
  );
}

export default SiteSettings;
