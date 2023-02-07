import { useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { TreeSelect } from 'primereact/treeselect';
import { InputTextarea } from 'primereact/inputtextarea';
import iconOptions from '../../../../services/doc/icons';
import { FieldArray, Formik } from 'formik';

const subContentType = [
  { name: 'list', code: 'list' },
  { name: 'list with icon', code: 'list-with-icon' },
];

export function AdvantageInput(props) {
  const { data, onUpdate, sectionId } = props;

  const [isEdit, setIsEdit] = useState(false);
  const [withSubContent, setWithSubContent] = useState(false);
  const [subContent, setSubContent] = useState({});

  //   console.log(data);

  //   console.log(subContent);

  const selectedType = useMemo(() => subContent?.type, [subContent?.type]);

  const handleDeleteContent = id => {
    const data = subContent?.content?.filter(v => v.id !== id);
    setSubContent(prev => ({
      ...prev,
      content: data,
    }));
  };

  return (
    <div className="p-3">
      <Formik
        initialValues={{
          title: data?.title,
          content: {
            body: data?.content?.body,
            type: data?.content?.type ?? '',
            list: data?.content?.list ?? [],
          },
        }}
        onSubmit={(values, actions) => {
          console.log(values);
          const payload = {
            section: sectionId,
            ...data,
            ...values,
            content: JSON.stringify(values?.content),
          };
          // onUpdate(payload, {
          //   onSuccess: () => {
          //     actions.setSubmitting(false);
          //     setIsEdit(false);
          //   },
          // });
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
                    onChange={e =>
                      setFieldValue('content.body', e.target.value)
                    }
                    name="content"
                    value={values.content.body}
                    rows={5}
                    className="w-full"
                  />
                ) : (
                  <p className="mb-2">{data?.content?.body}</p>
                )}
              </div>
            </div>
            <div className="field grid align-items-start">
              <label className="col-12 mb-2 md:col-2 md:mb-0">
                Sub Content
              </label>

              <div className="col-12 md:col-10 align-items-start">
                <div className="grid gap-4">
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
                            setFieldValue('content.list', [{ id: 1 }]);
                            // setSubContent(prev => ({
                            //   ...prev,
                            //   type: code,
                            //   content: [{ id: 1 }],
                            // }));
                            // const data = subContents.map((subList) => {
                            //     if (subList.id === v.id) {
                            //         return {
                            //             ...subList,
                            //             type: code,
                            //         };
                            //     }
                            //     return subList;
                            // });
                            // setSubContent(data);
                          }}
                          placeholder="Select type"
                          className="w-full md:w-14rem"
                        />
                      </div>
                      {values.content?.type && (
                        <FieldArray name="list">
                          {({ insert, remove, push }) => (
                            <div className="col-12 grid gap-4">
                              {values.content?.list?.map(list => (
                                <div
                                  className="col-12 flex gap-4"
                                  key={list?.id}
                                >
                                  {values.content.type === 'list' && (
                                    <InputText
                                      className="w-full"
                                      placeholder="type here to add list item"
                                      onChange={e => {
                                        const { value } = e?.target;
                                        const data = subContent.content.map(
                                          subList => {
                                            if (subList?.id === list?.id) {
                                              return {
                                                ...subList,
                                                body: value,
                                              };
                                            }
                                            return subList;
                                          }
                                        );

                                        if (!list?.body) {
                                          setSubContent(prev => ({
                                            ...prev,
                                            content: [
                                              ...data,
                                              {
                                                id: list.id + 1,
                                              },
                                            ],
                                          }));
                                          return;
                                        }

                                        setSubContent(prev => ({
                                          ...prev,
                                          content: [...data],
                                        }));
                                      }}
                                    />
                                  )}
                                  {selectedType === 'list-with-icon' && (
                                    <div className=" flex w-full gap-3 relative">
                                      <TreeSelect
                                        value={list.icon}
                                        options={iconOptions}
                                        filter
                                        // optionLabel
                                        placeholder="Select icon"
                                        className="md:w-20rem w-full"
                                        onChange={e => {
                                          const { value } = e;
                                          const data = subContent.content.map(
                                            subList => {
                                              if (subList?.id === list?.id) {
                                                return {
                                                  ...subList,
                                                  icon: value,
                                                };
                                              }
                                              return subList;
                                            }
                                          );

                                          if (!list?.icon) {
                                            setSubContent(prev => ({
                                              ...prev,
                                              content: [
                                                ...data,
                                                {
                                                  id: list.id + 1,
                                                },
                                              ],
                                            }));
                                            return;
                                          }

                                          setSubContent(prev => ({
                                            ...prev,
                                            content: [...data],
                                          }));
                                        }}
                                      />
                                      <InputText
                                        className="w-full"
                                        placeholder="type here to add list item"
                                        onChange={e => {
                                          const { value } = e?.target;
                                          const data = subContent.content.map(
                                            subList => {
                                              if (subList?.id === list?.id) {
                                                return {
                                                  ...subList,
                                                  body: value,
                                                };
                                              }
                                              return subList;
                                            }
                                          );

                                          setSubContent(prev => ({
                                            ...prev,
                                            content: [...data],
                                          }));
                                        }}
                                      />
                                    </div>
                                  )}
                                  {list?.body && (
                                    <Button
                                      className="p-button-danger"
                                      onClick={() =>
                                        handleDeleteContent(list.id)
                                      }
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
                  {isEdit && !withSubContent && (
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
      <div className="field grid">
        <div className="flex px-2 justify-content-end w-full">
          {isEdit ? (
            <Button onClick={() => setIsEdit(false)}>Submit</Button>
          ) : (
            <Button onClick={() => setIsEdit(true)}>Edit</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdvantageInput;

function SubContentInput() {
  return <div>SubContentInput</div>;
}
