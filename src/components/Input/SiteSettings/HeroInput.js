import { Formik } from 'formik';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { useState } from 'react';
import { FileUploader } from '../BaseInput';

export function HeroInput(props) {
  const { data, onUpdate, sectionId } = props;
  const [isEdit, setIsEdit] = useState(false);

  return (
    <div className="p-3">
      <Formik
        initialValues={{
          title: data?.title,
          content: data?.content?.body,
        }}
        onSubmit={(values, actions) => {
          const payload = {
            section: sectionId,
            ...data,
            ...values,
            content: JSON.stringify({
              body: values?.content,
            }),
          };
          onUpdate(payload, {
            onSuccess: () => {
              actions.setSubmitting(false);
              setIsEdit(false);
            },
          });
        }}
      >
        {({ handleSubmit, values, setFieldValue, isSubmitting }) => (
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
                  <p className="mb-2">{data?.title}</p>
                )}
              </div>
            </div>
            <div className="field grid align-items-start">
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
                  <p className="mb-2">{data?.content?.body}</p>
                )}
              </div>
            </div>
            <div className="field ">
              <FileUploader isEdit={isEdit} defaultValue={data?.image} />
            </div>
            <div className={isEdit ? 'field grid' : 'hidden'}>
              <div className="flex gap-3 px-2 justify-content-end w-full">
                <Button
                  className={!isEdit ? 'hidden' : 'p-button-danger'}
                  onClick={() => setIsEdit(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  className={!isEdit && 'hidden'}
                  type="submit"
                  loading={isSubmitting}
                >
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
