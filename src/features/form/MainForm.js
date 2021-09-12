import { Formik, Form, Field, FieldArray, useFormikContext } from 'formik'
import React, { Fragment, useEffect } from 'react'
import Geometry, { geometryInitialValues } from './components/Geometry'
import Material, { materialInitialValues } from './components/Material'
import Surface, { surfaceInitialValues } from './components/Surface'
import {MyTextInput} from "./fields/MyTextInput";
import {MyTextArea} from "./fields/MyTextArea";
import { Link } from 'react-router-dom'
import { validateField } from './Helpers'

export const formInitialValues = {
    serviceType: '',
    blankSource: '',
    substrateSource: '',
    stockSize: '',
    material: materialInitialValues,
    geometry: geometryInitialValues,
    surface: [surfaceInitialValues],
    quantity: '',
    specialInstructions:''
}

const SwitchServiceType = () => {

    const { values, setValues } = useFormikContext()

    useEffect(() => {
        const temp = values.serviceType
        setValues({...formInitialValues, serviceType: temp}, false)
    }, [values.serviceType, setValues])

    return null
}

const setDefaultValues = (setFieldValue, values) => {
    if (values.geometry.minorDiameter === '') {
        setFieldValue('geometry.minorDiameter', values.geometry.MajorDiameter)
    }
}

export default function MainForm({part, setPart}) {

    function handleAddPart(e, values, resetForm, setFieldValue, validateForm) {
        e.preventDefault()

        validateForm().then(errors => {
            console.log(errors)
            if (errors.length > 0) {
                setDefaultValues(setFieldValue, values)
                localStorage.setItem(`part${part}`, JSON.stringify(values))
                setPart(part+1)
                resetForm()
            }
        })

    }

    return (
        <Fragment>
            <h1>Request Form</h1>
            <Formik
                initialValues={formInitialValues}
                onSubmit={
                    async (values) => {
                        console.log(values)
                        await new Promise((r) => setTimeout(r, 500));
                        alert(JSON.stringify(values, null, 2));
                    }}
                >
                {({values, setFieldValue, validateForm, handleChange, resetForm, errors}) => (
                    <Form>
                        <SwitchServiceType />
                        <h1 id="service-type">Service Type: </h1>
                        <div role="group" aria-labelledby="service-type">
                            <label>
                            <Field type="radio" name="serviceType" value="SPDT Optic" />
                            SPDT Optic
                            </label>

                            <label>
                            <Field type="radio" name="serviceType" value="Optical Coating" />
                            Optical Coating
                            </label>
                            <label>
                            <Field type="radio" name="serviceType" value="Photonic Coating" />
                            Photonic Coating
                            </label>
                            <label>
                                <Field type="radio" name="serviceType" value="Integrated Optic Chip, Assembly and Others" />
                                Integrated Optic Chip, Assembly and Others
                            </label>                        
                        </div>
                        <div>Picked: {values.serviceType}</div>
                            {
                                values.serviceType === "SPDT Optic" && (
                                    <Fragment>
                                        <label className="required">
                                            Blank source:
                                            <Field validate={validateField} name='blankSource' as='select'>
                                                <option value='N/A'>Please Select</option>
                                                <option value='ANFF supplied'>ANFF supplied – full custom</option>
                                                <option value='Customer supplied'>Customer supplied</option>
                                            </Field>
                                            <Material 
                                                serviceType='spdt' 
                                                handleChange={handleChange} 
                                                materialValues={values.material}
                                            />
                                            <Geometry
                                                handleChange={handleChange}
                                                geometryValues={values.geometry}
                                                blankSource={values.blankSource}
                                                substrateSource={'N/A'}
                                            />
                                            <FieldArray
                                                name='surface'
                                            >
                                                {({push, pop}) => (
                                                    <div>
                                                        {values.surface.map((side, index) => (
                                                            <Surface 
                                                                key={index}
                                                                index={index} 
                                                                handleChange={handleChange}
                                                                surfaceValues={values.surface[index]}
                                                                blankSource={values.blankSource}
                                                                substrateSource={'N/A'}
                                                            />
                                                        ))}
                                                        <button type='button' onClick={() => push(surfaceInitialValues)}>Add a side</button>
                                                        <button type='button' onClick={() => pop()}>Remove last side</button>
                                                    </div>
                                                )}
                                            </FieldArray>
                                            <br />
                                            <MyTextInput label='Quantity:' name='quantity' onChange={handleChange} />
                                            <MyTextArea
                                                label='Special instructions:'
                                                name='specialInstructions'
                                                placeholder='Leave the description here'
                                                rows={3}
                                                onChange={handleChange}
                                            />
                                            <label>
                                                Upload PDF/PNG File:
                                            </label>
                                            <input type="file" name='specialInstructionFile' accept=".pdf,.png" />
                                        </label>
                                    </Fragment>
                                )
                            }
                            {
                                values.serviceType === "Optical Coating" && (
                                    <Fragment>
                                        <label className="required">
                                            Substrate source:
                                            <Field validate={validateField} name='substrateSource' as='select'>
                                                <option value='N/A'>Please select</option>
                                                <option value='ANFF supplied – stock'>ANFF supplied – stock</option>
                                                <option value='Customer supplied'>Customer supplied</option>
                                                <option value='ANFF supplied – full custom'>ANFF supplied – full custom</option>
                                            </Field>
                                            {
                                                values.substrateSource === "ANFF supplied – stock" &&(
                                                    <Fragment>
                                                        <label><br />
                                                            In stock:
                                                            <Field name='stockSize' as='select' onChange={handleChange}>
                                                                <option value='N/A'>Please Select</option>
                                                                <option value='12.7mm'>12.7mm</option>
                                                                <option value='25.4mm'>25.4mm</option>
                                                                <option value='50.8mm'>50.8mm</option>
                                                            </Field>
                                                        </label>
                                                    </Fragment>
                                                )
                                            }
                                            {
                                                (values.substrateSource === "Customer supplied"||values.substrateSource === "ANFF supplied – full custom") &&(
                                                    <Fragment>
                                                        <Material
                                                            serviceType='optical'
                                                            handleChange={handleChange}
                                                            materialValues={values.material}
                                                        />
                                                        <Geometry
                                                            handleChange={handleChange}
                                                            geometryValues={values.geometry}
                                                            blankSource={'N/A'}
                                                            substrateSource={values.substrateSource}
                                                            serviceType={values.serviceType}
                                                        />
                                                    </Fragment>
                                                )
                                            }
                                            <FieldArray
                                                name='surface'
                                            >
                                                {({push, pop}) => (
                                                    <div>
                                                        {values.surface.map((side, index) => (
                                                            <Surface
                                                                key={index}
                                                                index={index}
                                                                handleChange={handleChange}
                                                                surfaceValues={values.surface[index]}
                                                                blankSource={'N/A'}
                                                                serviceType={values.serviceType}
                                                                substrateSource={values.substrateSource}
                                                                geometry={values.geometry.geometryType}
                                                            />
                                                        ))}
                                                        <button type='button' onClick={() => push(surfaceInitialValues)}>Add a side</button>
                                                        <button type='button' onClick={() => pop()}>Remove last side</button>
                                                    </div>
                                                )}
                                            </FieldArray>

                                            {
                                                (values.substrateSource === "ANFF supplied-stock"||values.substrateSource === "Customer supplied"||values.substrateSource === "ANFF supplied – full custom") &&(
                                                    <Fragment>
                                                        <br />
                                                        <MyTextInput label='Quantity:' name='quantity' onChange={handleChange} />
                                                        <MyTextArea
                                                            label='Special instructions:'
                                                            name='specialInstructions'
                                                            placeholder='Leave the description here'
                                                            rows={3}
                                                            onChange={handleChange}
                                                        />
                                                        <label>
                                                            Upload PDF/PNG File:
                                                        </label>
                                                        <input type="file" name='specialInstructionFile' accept=".pdf,.png" />
                                                    </Fragment>
                                                )
                                            }
                                        </label>
                                    </Fragment>
                                )
                            }
                        {
                            values.serviceType === "Photonic Coating" && (
                                <Fragment>
                                    <label>
                                        Substrate source:
                                        <Field name='substrateSource' as='select'>
                                            <option value='N/A'>Please select</option>
                                            <option value='ANFF supplied – stock'>ANFF supplied – stock</option>
                                            <option value='Customer supplied'>Customer supplied</option>
                                            <option value='ANFF supplied – full custom'>ANFF supplied – full custom</option>
                                        </Field>
                                        {
                                            values.substrateSource === "ANFF supplied – stock" &&(
                                                <Fragment>
                                                    <label><br />
                                                        In stock:
                                                        <Field name='stockSize' as='select' onChange={handleChange}>
                                                            <option value='N/A'>Please Select</option>
                                                            <option value='(Silicon (P-type, <100>) ø100mm x 525µm'>Silicon (P-type, &lt;100&gt;) ø100mm x 525µm</option>
                                                            <option value='5µm TOx on Silicon (P-type, <100>) ø100mm x 525µm'>5µm TOx on Silicon (P-type, &lt;100&gt;) ø100mm x 525µm</option>
                                                            <option value='Silicon (P-type, <100>) ø150mm x 675µm'>Silicon (P-type, &lt;100&gt;) ø150mm x 675µm</option>
                                                        </Field>
                                                    </label>
                                                </Fragment>
                                            )
                                        }
                                        {
                                            (values.substrateSource === "Customer supplied"||values.substrateSource === "ANFF supplied – full custom") &&(
                                                <Fragment>
                                                    <Material
                                                        serviceType='photonic'
                                                        handleChange={handleChange}
                                                        materialValues={values.material}
                                                    />
                                                    <Geometry
                                                        handleChange={handleChange}
                                                        geometryValues={values.geometry}
                                                        blankSource={'N/A'}
                                                        substrateSource={values.substrateSource}
                                                    />
                                                </Fragment>
                                            )
                                        }
                                        <FieldArray
                                            name='surface'
                                        >
                                            {({push, pop}) => (
                                                <div>
                                                    {values.surface.map((side, index) => (
                                                        <Surface
                                                            key={index}
                                                            index={index}
                                                            handleChange={handleChange}
                                                            surfaceValues={values.surface[index]}
                                                            blankSource={'N/A'}
                                                            serviceType={values.serviceType}
                                                            substrateSource={values.substrateSource}
                                                        />
                                                    ))}
                                                    <button type='button' onClick={() => push(surfaceInitialValues)}>Add a side</button>
                                                    <button type='button' onClick={() => pop()}>Remove last side</button>
                                                </div>
                                            )}
                                        </FieldArray>
                                        {
                                            (values.substrateSource === "ANFF supplied-stock"||values.substrateSource === "Customer supplied"||values.substrateSource === "ANFF supplied – full custom") &&(
                                                <Fragment>
                                                    <br />
                                                    <MyTextInput label='Quantity:' name='quantity' onChange={handleChange} />
                                                    <MyTextArea
                                                        label='Special instructions:'
                                                        name='specialInstructions'
                                                        placeholder='Leave the description here'
                                                        rows={3}
                                                        onChange={handleChange}
                                                    />
                                                    <label>
                                                        Upload PDF/PNG File:
                                                    </label>
                                                    <input type="file" name='specialInstructionFile' accept=".pdf,.png" />
                                                </Fragment>
                                            )
                                        }
                                    </label>
                                </Fragment>
                            )
                        }
                        {
                            values.serviceType === "Integrated Optic Chip, Assembly and Others" && (
                                <Fragment>
                                    <label>
                                        For any requests or info about integrated optics and chip assembly please feel free to contact the following:<br />
                                        Node Director: A/Prof. Steve Madden<br />
                                        Email: stephen.madden@anu.edu.au<br />
                                        Phone: (02) 612 58574 or 0404 932 099<br />
                                    </label>
                                    <br />
                                </Fragment>
                            )
                        }
                        {
                            (values.serviceType === "SPDT Optic"||values.serviceType === "Optical Coating"||values.serviceType === "Photonic Coating") && (
                                <Fragment>
                                    <div>
                                    <button onClick={(e) => handleAddPart(e, values, resetForm, setFieldValue, validateForm)} className='add'>Add another part</button>
                                    <button onClick = {(e) => handleAddPart(e, values, resetForm)}>
                                        <Link style={{color: 'black', textDecoration: 'none'}} to='/customer'>Enter customer information (please ensure all information are entered)</Link>
                                    </button>
                                    </div>
                                </Fragment>
                            )
                        }
                    
                    </Form>
                )}
            </Formik>
        </Fragment>
    )
}
