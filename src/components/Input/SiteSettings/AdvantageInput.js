import { FieldArray, Formik } from 'formik';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { TreeSelect } from 'primereact/treeselect';
import { useMemo, useState } from 'react';
import iconOptions from '../../../../services/doc/icons';
import { FileUploader } from '../BaseInput';

const subContentType = [
  { name: 'list', code: 'list' },
  { name: 'list with icon', code: 'list-with-icon' },
];

export function AdvantageInput(props) {
  const { data, onUpdate, sectionId } = props;

  const [isEdit, setIsEdit] = useState(false);
  const [withSubContent, setWithSubContent] = useState(!!data?.content?.list);

  return (
    <div className="p-3">
      {isEdit ? (
        <Formik
          initialValues={{
            title: data?.title,
            content: {
              body: data?.content?.body,
              type: data?.content?.type ?? '',
              list: data?.content?.list ?? [],
            },
            image: data?.image,
          }}
          onSubmit={(values, actions) => {
                        const list = values?.content?.list?.filter(
                            val => !!val
                        );

                        const content = {
                            ...values?.content,
                            list,
                        };

                        const payload = {
                            ...data,
                            ...values,
                            section: sectionId,
                            content: JSON.stringify(content),
                        };

                        onUpdate(payload, {
                            onSuccess: () => {
                                actions.setSubmitting(false);
                                setIsEdit(false);
                            },
                        });
                    }}
        >
          {({
            handleSubmit,
            values,
            setFieldValue,
            isSubmitting,
            resetForm,
          }) => (
            <form onSubmit={handleSubmit}>
              <div className="field grid">
                <label className="col-12 mb-2 md:col-2 md:mb-0">Title</label>
                <div className="col-12 md:col-10">
                  <InputText
                    name="title"
                    value={values.title}
                    onChange={e => setFieldValue('title', e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="field grid align-items-start">
                <label className="col-12 mb-2 md:col-2 md:mb-0">
                  Description
                </label>
                <div className="col-12 md:col-10">
                  <InputTextarea
                    onChange={e =>
                      setFieldValue('content.body', e.target.value)
                    }
                    name="content"
                    value={values.content.body}
                    rows={5}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="field">
                <FileUploader
                  isEdit={true}
                  defaultValue={values?.image}
                  onUpload={e => {
                    setFieldValue('image', e);
                  }}
                />
              </div>

              <div className="field grid align-items-start">
                <label className="col-12 mb-2 md:col-2 md:mb-0">
                  Sub Content
                </label>

                <div className="col-12 md:col-10">
                  <div className="grid gap-4 align-items-start mt-0">
                    {withSubContent && (
                      <>
                        <div className="col-12">
                          <Dropdown
                            options={subContentType}
                            optionLabel="name"
                            value={subContentType?.find(
                              opt => opt.code === values.content.type
                            )}
                            onChange={e => {
                              const selected = e.value;
                              const { code } = selected;
                              setFieldValue('content.type', code);
                              setFieldValue('content.list', [{ id: 0 }]);
                            }}
                            placeholder="Select type"
                            className="w-full md:w-14rem"
                          />
                        </div>
                        {values.content?.type && (
                          <FieldArray name="content.list">
                            {({ insert, remove, push }) => (
                              <div className="col-12 grid gap-4">
                                {values.content?.list?.map((item, index) => (
                                  <div
                                    className="col-12 flex gap-4"
                                    key={index}
                                  >
                                    {values.content.type === 'list' && (
                                      <InputText
                                        className="w-full"
                                        placeholder="type here to add list item"
                                        value={item?.body ?? ''}
                                        onChange={e => {
                                          const { value } = e?.target;
                                          setFieldValue(
                                            `content.list[${index}]`,
                                            {
                                              id: index,
                                              body: value,
                                            }
                                          );
                                          if (!item?.body) {
                                            insert(index + 1);
                                          }
                                        }}
                                      />
                                    )}
                                    {values.content.type ===
                                      'list-with-icon' && (
                                      <div className=" flex w-full gap-3 relative">
                                        <TreeSelect
                                          value={item?.icon ?? ''}
                                          options={iconOptions}
                                          filter
                                          // optionLabel
                                          placeholder="Select icon"
                                          className="md:w-20rem w-full"
                                          onChange={e => {
                                            const { value } = e;
                                            setFieldValue(
                                              `content.list[${index}]`,
                                              {
                                                id: index,
                                                icon: value,
                                              }
                                            );
                                          }}
                                        />
                                        <InputText
                                          className="w-full"
                                          placeholder="type here to add list item"
                                          onChange={e => {
                                            const { value } = e?.target;
                                            setFieldValue(
                                              `content.list[${index}]`,
                                              {
                                                ...item,
                                                body: value,
                                              }
                                            );
                                            if (!item?.body) {
                                              insert(index + 1);
                                            }
                                          }}
                                          value={item?.body ?? ''}
                                        />
                                      </div>
                                    )}
                                    {item?.body && (
                                      <Button
                                        className="p-button-danger"
                                        onClick={() => remove(index)}
                                      >
                                        <i className="pi pi-delete-left" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </FieldArray>
                        )}
                      </>
                    )}
                    {!withSubContent && (
                      <div className="col-12">
                        <Button
                          onClick={() => {
                            setWithSubContent(true);
                          }}
                        >
                          <i className="pi pi-plus" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={'field grid'}>
                <div className="flex gap-3 px-2 justify-content-end w-full">
                  <Button
                    className={'p-button-danger'}
                    onClick={() => {
                      setIsEdit(false);
                      resetForm();
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    Submit
                  </Button>
                </div>
              </div>
            </form>
          )}
        </Formik>
      ) : (
        <DisplayContent data={data} />
      )}
      <div className="field grid">
        <div className="flex px-2 justify-content-end w-full">
          {!isEdit && <Button onClick={() => setIsEdit(true)}>Edit</Button>}
        </div>
      </div>
    </div>
  );
}

export default AdvantageInput;

function DisplayContent({ data }) {
  return (
    <>
      <div className="field grid">
        <label className="col-12 mb-2 md:col-2 md:mb-0">Title</label>
        <div className="col-12 md:col-10">
          <p className="mb-2">{data?.title}</p>
        </div>
      </div>
      <div className="field grid align-items-start">
        <label className="col-12 mb-2 md:col-2 md:mb-0">Description</label>
        <div className="col-12 md:col-10">
          <p className="mb-2">{data?.content?.body}</p>
        </div>
      </div>

      <div className="field">
        <FileUploader defaultValue={data?.image} />
      </div>

      <div className="field grid align-items-start">
        <label className="col-12 mb-2 md:col-2 md:mb-0">Sub Content</label>

        <div className="col-12 md:col-10">
          <div className="grid gap-4 align-items-start mt-0">
            <div className="col-12">
              {data.content.type ? (
                <p className="mb-2">type: {data.content.type}</p>
              ) : (
                '-'
              )}
            </div>
            {data.content?.type && (
              <div className="col-12 grid gap-4">
                {data.content?.list?.map((item, index) => (
                  <div className="col-12 flex gap-4" key={index}>
                    {data.content.type === 'list' && (
                      <p className="mb-2">{item?.body}</p>
                    )}
                    {data.content.type === 'list-with-icon' && (
                      <div className=" flex w-full gap-3 relative">
                        <span
                          className={`pi pi-${item?.icon} mr-3`}
                          style={{ fontSize: '1.5rem' }}
                        />

                        <p className="mb-2">{item?.body}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
