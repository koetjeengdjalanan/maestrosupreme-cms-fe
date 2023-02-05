import { Formik, useFormik } from 'formik';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useState } from 'react';

export function HeroInput(props) {
  const { data, onUpdate } = props;
  const [isEdit, setIsEdit] = useState(false);

  console.log(data);

  return (
    <div className="p-3">
      <Formik
        initialValues={{
          title: data?.title,
          content: data?.content?.body,
        }}
        onSubmit={(values, actions) => {
          setTimeout(() => {
            console.log(values);
            console.log(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }, 1000);
        }}
      >
        {({ handleSubmit, values, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div className="field grid">
              <label className="col-12 mb-2 md:col-2 md:mb-0">Title</label>
              <div className="col-12 md:col-10">
                {isEdit ? (
                  <InputText
                    name="title"
                    value={values.title}
                    onChange={e => setFieldValue('title', e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <p></p>
                )}
              </div>
            </div>
            <div className="field grid">
              <label className="col-12 mb-2 md:col-2 md:mb-0">
                Description
              </label>
              <div className="col-12 md:col-10">
                {isEdit ? (
                  <InputTextarea
                    onChange={e => setFieldValue('content', e.target.value)}
                    name="content"
                    value={values.content}
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
        )}
      </Formik>
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
