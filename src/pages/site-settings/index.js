import React from 'react';

import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import {
  AdvantageInput,
  HeroInput,
  OfferingInput,
  ReviewInput,
} from '@/components/Input/SiteSettings';
import { useMainContent } from '@/hooks';

function SiteSettings() {
  const { data } = useMainContent();

  console.log(data);

  return (
    <Accordion activeIndex={0}>
      <AccordionTab header="Hero">
        <HeroInput />
      </AccordionTab>
      <AccordionTab header="Advantage-1">
        <AdvantageInput />
      </AccordionTab>
      <AccordionTab header="Advantage-2x">
        <AdvantageInput />
      </AccordionTab>
      <AccordionTab header="Offers">
        <OfferingInput />
      </AccordionTab>
      <AccordionTab header="Reviews">
        <ReviewInput />
      </AccordionTab>
    </Accordion>
  );
}

export default SiteSettings;
