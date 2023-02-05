import { useFormik } from 'formik';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';

export function HeroInput(props) {
  const { data, onUpdate } = props;
  const [isEdit, setIsEdit] = useState(false);

  const formik = useFormik({
    initialValues: {
      //   ...data,
    },
    // validate: data => {
    //   let errors = {};

    //   if (!data.item) {
    //     errors.item = 'Checked is required.';
    //   }

    //   return errors;
    // },
    onSubmit: data => {
      console.log(data);
      console.log('data');
      // data.item && show();
      //   formik.resetForm();
    },
  });

  const { handleSubmit, values, setFieldValue } = formik;

  return (
    <div className="p-3">
      <form onSubmit={handleSubmit}>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Title</label>
          <div className="col-12 md:col-10">
            {isEdit ? (
              <InputText
                name="title"
                onChange={e => setFieldValue('title', e.target.value)}
                value={values?.title}
                className="w-full"
              />
            ) : (
              <p></p>
            )}
          </div>
        </div>
        <div className="field grid">
          <label className="col-12 mb-2 md:col-2 md:mb-0">Description</label>
          <div className="col-12 md:col-10">
            {isEdit ? (
              <InputTextarea
                onChange={e => setFieldValue('content', e.target.value)}
                name="content"
                value={values?.content}
                rows={5}
                className="w-full"
              />
            ) : (
              <p></p>
            )}
          </div>
        </div>
        <div className={isEdit ? 'field grid' : 'hidden'}>
          <div className="flex px-2 justify-content-end w-full">
            <Button className={!isEdit && 'hidden'} type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>
      {!isEdit && (
        <div className="field grid">
          <div className="flex px-2 justify-content-end w-full">
            <Button
              className={isEdit && 'hidden'}
              type="button"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default HeroInput;
