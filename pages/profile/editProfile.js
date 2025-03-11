import cookie from 'cookie'
import {FaPlus} from 'react-icons/fa'
import { useEffect, useRef, useState } from 'react'
import ErrorModal from '../../components/errorModal'
import DashboardTop from '../../components/dashboardTop'
import { useForm } from 'react-hook-form'
import CropModal from '../../components/cropModal'
import { useDebounceEffect } from '../../helpers/useDebounceEffect'
import { canvasPreview } from '../../helpers/canvasPreview'
import states from "../../helpers/states.json"
import countries from "../../helpers/countries.json"
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { useRouter } from 'next/router'
import uuid from 'react-uuid'
import { getArtistProfile } from '../api/getArtistProfile'
import { getGenres } from '../api/getGenres'

export async function getServerSideProps(context) {
  let userInfo = cookie.parse(context.req.headers.cookie);
  let senddata = {};
  senddata.token = userInfo.abreakmusic_token;
  senddata.username = userInfo.abreakmusic_username;
  senddata.action = "get";
  senddata.role = "artist";

  const artistdata = await getArtistProfile(senddata);

  if(!artistdata || artistdata.status == "ERROR"){
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
      props:{},
    };
  }
  const genreResult = await getGenres();

  return {
    props: {data: artistdata.results[0], username: userInfo.abreakmusic_username, genres: genreResult}, // will be passed to the page component as props
  }
}

export default function Page(props) {
    
    const { register, handleSubmit, watch, getValues, setError, clearErrors, formState: { errors } } = useForm();
    const [completedCrop, setCompletedCrop] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorContent, setErrorContent] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const [hasProfileImage, setHasProfileImage] = useState(false);
    const [artistName, setArtistName] = useState(null);
    const [phoneValue, setPhoneValue] = useState()
    const previewCanvasRef = useRef();
    const [fileKey, setFileKey] = useState();
    const [loadingMsg, setLoadingMsg] = useState(false);
    const [formSubmitReady, setFormSubmitReady] = useState(false);
    const [presignedUrl, setPresignedUrl] = useState(null);
    const [formattedPhoneNumber, setFormattedPhoneNumber]= useState(null);
    const [stateSelect, setStateSelect] = useState(props.data.state);
    const [countrySelect, setCountrySelect] = useState(props.data.country);
    const [stateValid, setStateValid]= useState(props.data.country == "US" ? true : false);

    const existingImgRef = useRef(null);
    const fileInputRef = useRef();
    const imgRef = useRef(null);
    const countrySelectRef = useRef(null);
    const stateSelectRef = useRef(null);

    const router = useRouter();
    const refreshData = () => {
      router.replace(router.asPath);
    }

    const onSubmit = (data) => {
      if(hasProfileImage == false){
          setError('artistimage', {type: 'required', message: "profile image is required"});
      }else {
          setArtistName(data.artistname);
          submitProfileForm(data);
      }
    };

    const submitProfileForm = (data) => {
      if(existingImgRef.current == null){
         setLoadingMsg(true);
         let imageid = uuid();
         let senddata = {
             id : imageid,
         }
         const login = fetch("../api/getPresignedImageUrl", {
             method: 'post',
             headers: new Headers({
             'Content-Type': 'application/json',
             Accept: 'application/json',
             }),
             body: JSON.stringify(senddata)
         }).then((res) => res.json())
         .then(async (data) => {
             setPresignedUrl(data.result);
             let fileToUpload = await getImageAsFile(data.filename);
             uploadFile(data.key, data.filename, fileToUpload, data.result);
         });
     }else {
         setFileKey(props.data.artistimage);
         setFormSubmitReady(true);
      }
    }

    useEffect(()=> {
      if(props.data.artistimage) {
          setHasProfileImage(true);
          clearErrors('artistimage', 'required');
      }
      if(completedCrop){
          setHasProfileImage(true);
          clearErrors('artistimage', 'required');
      }
    }, [props.data.artistimage, completedCrop])

    const handleFileButtonClick = () => {
      fileInputRef.current.click();
    }

    const getImageAsFile = async (filename) => {
      const imageFile = await new Promise((resolve, reject) => {
          previewCanvasRef.current.toBlob(file => {
            file.name = filename;
            resolve(file);
          }, 'image/jpeg');
        });
      return imageFile;
    }

    const uploadFile = async(filekey, filename, fileToUpload, presigned) => {

        const result = await new Promise((resolve,reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', presigned, true);
            xhr.onload = (e) => {
                let resultData = {
                    key: filekey
                }
                resolve(resultData);
                if (xhr.status === 200) {
                    console.log('Uploaded data successfully');
                }
            };
            
            xhr.onerror = () => {
                reject('error in file upload');
            };
            xhr.send(fileToUpload);
        });
        
        setFileKey(filekey);
        setFormSubmitReady(true);
    }

    const fileSelected = (e) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            //Image URL e.target.result
            setImgSrc(e.target.result);
            setShowCropModal(true);
        }
        reader.readAsDataURL(e.target.files[0]);
    }

    useDebounceEffect(
      async () => {
        if (
          completedCrop?.width &&
          completedCrop?.height &&
          imgRef.current &&
          previewCanvasRef.current
        ) {
          // We use canvasPreview as it's much faster than imgPreview.
          canvasPreview(
            imgRef.current,
            previewCanvasRef.current,
            completedCrop
          )
        }
      },
      100,
      [completedCrop],
    )

    const handleGenreChange = (e) => {
      let genres =  getValues();
      if(genres.genre.length > 4){
          setError('genre', {type: 'maxLength', message: "please select no more than 4 genres"});
      }
      if(genres.genre.length < 5){
          clearErrors('genre', 'maxLength');
      }
    }
    
    const handleChecked = (id) => {
        let genreArr = props.data.genre.split(",");
        if(genreArr.includes(id.toString())){
            return "checked";
        }
    }

    const finalFormSubmit = (data) => {
      setLoadingMsg(true);
      let updatedFormData = getValues();
      updatedFormData.artistimage = data.artistimage;
      console.log(countrySelect, stateSelect);
      updatedFormData.country = countrySelect;
      updatedFormData.state = stateSelect;
      const update = fetch("../api/updateArtistProfileFull", {
          method: 'post',
          headers: new Headers({
            'Content-Type': 'application/json',
            Accept: 'application/json',
          }),
          body: JSON.stringify(updatedFormData)
      }).then((res) => res.json())
      .then(async (data) => {
          setLoadingMsg(false);
          setFormSubmitReady(false);
          refreshData();
      });
  }


  const handleCountryChange = () => {
        let countrySelected = countrySelectRef.current.value;
        let stateSelected = stateSelectRef.current?.value;
        setCountrySelect(countrySelected);
        if(countrySelected != "US"){
            setStateSelect("");
            setStateValid(false);
        }else {
            setStateValid(true);
        }
    }

    const handleStateChange = () => {
        let stateSelected = stateSelectRef.current.value;
        setStateSelect(stateSelected);
    }

  useEffect(() => {
      if(formSubmitReady == true){
          let data = {};
          data.artistimage = fileKey;
          finalFormSubmit(data);
      }
  }, [formSubmitReady])


    return (
        <div className="w-full">

            {loadingMsg==true &&
                <div className="fixed z-[9999] top-0 left-0 text-center flex justify-center items-center w-full h-full bg-white/75">
                    <img src={`${process.env.NEXT_PUBLIC_ABREAK_WORDPRESS}/wp-content/uploads/2022/01/abreak-loading-animation-white.svg`} width="100" height="auto"/>
                </div>
            }
            <DashboardTop props={props}></DashboardTop>
            <div className="dashboard-bottom px-[4vw] py-5">
                <h2 className="text-2xl mb-4">profile</h2>

                <CropModal
                    imgSrc={imgSrc}
                    imgRef={imgRef}
                    onClose={() => setShowCropModal(false)}
                    submitCrop={() => setSubmitCrop(src)}
                    onCropComplete={(c) => setCompletedCrop(c)}
                    onCancel={() => cancelCrop()}
                    show={showCropModal}
                >
                </CropModal>
                <form className="abreak-form" onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex lg:flex-row flex-col items-center mb-4">
                    <div>
                        {!completedCrop && props.data.artistimage && (
                            <img
                                alt="profile image"
                                ref={existingImgRef}
                                width="300px"
                                height="400px"
                                className="mr-4 border-2 border-black"
                                src={process.env.NEXT_PUBLIC_CLOUDFRONT_BASE + props.data.artistimage} />
                        )}
                        {!!completedCrop && (
                            <canvas
                                ref={previewCanvasRef}
                                style={{
                                border: '1px solid black',
                                objectFit: 'contain',
                                width: 300,
                                height: 300,
                                }}
                                className="mr-4"
                            />
                        )}
                    </div>
                    <div className="mb-4 lg:mt-0 mt-4 relative">
                        <button type="button" className="yellow-button w-full lg:w-auto justify-center" onClick={handleFileButtonClick}>select an image</button>
                        <input
                            type="file"
                            onChange={fileSelected}
                            ref={fileInputRef}
                            hidden
                        />
                        {errors.artistimage && (<span className="form-error">{errors.artistimage.message}</span>)}
                        <p><small>required: image types accepted: .png, .jpg. </small></p>
                    </div>
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="artistname" className="py-2 block">artist name</label>
                    <input 
                        className="w-full" 
                        placeholder="artist name" 
                        {...register("artistname", {
                            required: "artist name is required",
                            maxLength: {
                                value: 50,
                                message: "artist name cannot be longer than 50 characters"
                            }
                    })} 
                        defaultValue={props.data.artistname}
                    />
                    {errors.artistname && (<span className="form-error">{errors.artistname.message}</span>)}
                </div>
                <div className="mb-4 relative">
                      <label htmlFor="artist_bio" className="text-center">bio <em>(please tell us about yourself)</em></label>
                      <p className="text-slate-700"><em>min: 50 characters, max: 1,500 characters</em></p>
                      <textarea
                          name="artist_bio"
                          className="block w-[100%] h-[200px] mt-6"
                          {...register('artist_bio', {
                              minLength: {
                                  value: 50,
                                  message: "bio must be at least 50 characters"
                              },
                              maxlength: {
                                  value: 1500,
                                  message: "bio cannot be longer than 1,500 characters"
                              }
                          })}
                          defaultValue={props.data.artist_bio}
                      ></textarea>
                      {errors.artist_bio && (<span className="form-error">{errors.artist_bio.message}</span>)}
                  </div>
                  <div className="border-b-2 pb-5 border-purple-200 py-5 mb-5">      
                    <div className="flex lg:flex-row flex-col items-start">
                          <div className="mb-4 lg:w-[50%] w-full lg:pr-2 relative">
                              <label htmlFor="firstname" className="block">contact first name</label>
                              <input 
                                  type="text" 
                                  name="firstname" 
                                  className="w-full"
                                  defaultValue={props.data.firstname}
                                  {...register('firstname', {
                                      required: "first name is required",
                                      maxlength: {
                                          value: 50,
                                          message: "first name can't be longer than 50 characters"
                                      }
                                  })}
                              />
                              {errors.firstname && (<span className="form-error">{errors.firstname.message}</span>)}
                          </div>
                          <div className="mb-4 lg:w-[50%] w-full lg:pl-2 relative">
                              <label htmlFor="firstname" className="block">contact last name</label>
                              <input 
                                  type="text" 
                                  name="lastname" 
                                  className="w-full"
                                  defaultValue={props.data.lastname}
                                  {...register('lastname', {
                                      required: "last name is required",
                                      maxlength: {
                                          value: 50,
                                          message: "last name can't be longer than 50 characters"
                                      }
                                  })}
                              />
                              {errors.lastname && (<span className="form-error">{errors.lastname.message}</span>)}
                          </div>
                      </div>
                      <div className="mb-4 relative">
                          <label htmlFor="agegroup">age range</label>
                          <p><small><em>(if a group, use average age)</em></small></p>
                          <select
                              name="agegroup" 
                              defaultValue={props.data.agegroup}
                              {...register('agegroup')}
                          >
                              <option key="select-age" value="">Select One</option>
                              <option key="age-16-24" value="16-24">16-24</option>
                              <option key="age-25-29" value="25-29">25-29</option>
                              <option key="age-30-34" value="30-34">30-34</option>
                              <option key="age-35+" value="35+">35+</option>
                          </select>
                      </div>
                    </div>
                    <div className="mb-4 relative border-b-2 pb-5 border-purple-200">
                        <label htmlFor="genre">genre</label>
                        <p><small><em>please select 1-4 genres</em></small></p>
                        <div className="genre-grid" onChange={handleGenreChange}>
                            {props.genres && props.genres.map((genre) => (
                                <div className="genre-check" key={genre.id}>
                                    <input 
                                     type="checkbox" 
                                     name="genre" 
                                     {...register('genre', {
                                        required: "at least one genre must be selected",
                                        max: {
                                            value: 4,
                                            message: "you can only select a total of 4 genres"
                                        },
                                        validate: {
                                            lessThanFive: v => {console.log(v); parseInt(v) < 5 || "no more than 4 genres accepted"},
                                        },
                                        onChange:(e) => {handleGenreChange}
                                     })}
                                     defaultChecked={handleChecked(genre.id)}
                                     value={genre.id} />
                                    <label htmlFor="genre">{genre.genre}</label>
                                </div>
                            ))}
                        </div>
                        {errors.genre && (<span className="form-error">{errors.genre.message}</span>)}
                    </div>
                    <div className="flex lg:flex-row flex-col items-start justify-between mb-4 border-b-2 pb-5 border-purple-200">
                        <div className="pr-5">
                            <label htmlFor="city" className="block">city</label>
                            <input 
                                type="text" 
                                name="city" 
                                defaultValue={props.data.city}
                                {...register('city', {
                                    required: "city is required",
                                })}
                            />
                            {errors.city && (<span className="form-error">{errors.city.message}</span>)}
                        </div>
                        <div className="lg:pr-5">
                            {stateValid && (
                                <>
                                    <label htmlFor="state" className="block">state</label>
                                    <select
                                        name="state" 
                                        defaultValue={props.data.state}
                                        {...register('state',
                                            {onChange:(e) => handleStateChange()}
                                        )}
                                        ref={stateSelectRef}
                                    >
                                        <option key="state-none" value=""></option>
                                        {states && states.map((state, i) => {
                                            return (
                                                <option key={state.abbreviation + i} value={state.abbreviation}>{state.name}</option>
                                            )
                                        })}
                                    </select>
                                </>
                            )}
                        </div>
                        <div className="lg:px-5">
                            <label htmlFor="country" className="block">country</label>
                            <select
                                name="country" 
                                defaultValue={props.data.country}
                                {...register('country',
                                    {onChange:(e) => handleCountryChange()}
                                )}
                                ref={countrySelectRef}
                            >
                                {countries && countries.map((country, i) => {
                                    return (
                                        <option key={country.code + i} value={country.code}>{country.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="flex lf:flex-row flex-col lg:items-center mb-4 mt-5 border-b-2 pb-5 border-purple-200">
                        <div className="lg:w-[50%] pr-4">
                            <label htmlFor="cellphone" className="block">cell phone</label>
                            <PhoneInput 
                                type="tel" 
                                name="cellphone" 
                                value={props.data.cellphone}
                                {...register('cellphone', {
                                  defaultCountry:"us"
                                })}
                                onChange={setPhoneValue}
                                
                                className="phone-input"
                            />
                            {errors.cellphone && (<span className="form-error">{errors.cellphone.message}</span>)}
                        </div>
                        <div className="lg:w-[50%] mt-4 lg:mt-0 pl-4 flex-column justify-center">
                            <div>
                                <input
                                    type="checkbox" 
                                    name="permission_to_text" 
                                    defaultValue={props.data.premission_to_text}
                                    {...register('permission_to_text')}
                                />
                                <label htmlFor="permissiontotext" className="pl-2">permission to text</label>
                            </div>
                            <div>
                                <p><em>aBreak music may use text to contact an artist about being on the playlist or other inquiries. read our terms & conditions</em></p>
                            </div>
                            {errors.cellphone && (<span className="form-error">{errors.cellphone.message}</span>)}
                        </div>
                    </div>

                    <div className="p-3 text-center mb-4">
                        <p><strong>social media is a way for us to get to know more about you. the number of followers you have is not important to us. we are, however, looking for passion and growth, in whatever form(s) - be it from you, your fans, whoever/whatever.</strong></p>
                    </div>
                    <div className="flex lg:flex-row flex-col items-start justify-between">
                        <div className="pr-2 lg:w-[50%]">
                            <h2 className="text-2xl mb-4">tell us where to find your music</h2>
                            <div className="mb-4 relative">
                                <label htmlFor="artist_website" className="block">artist website (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="artist_website" 
                                    defaultValue={props.data.artist_website}
                                    {...register('artist_website')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="spotify_link" className="block">spotify link (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="spotify_link" 
                                    defaultValue={props.data.spotify_link}
                                    {...register('spotify_link')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="apple_music" className="block">apple music (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="apple_music" 
                                    defaultValue={props.data.apple_music}
                                    {...register('apple_music')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="youtube_link" className="block">youtube link (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="youtube_link" 
                                    defaultValue={props.data.youtube_link}
                                    {...register('youtube_link')}
                                />
                            </div>
                        </div>
                        <div className="pl-2 lg:w-[50%] mt-4 lg:mt-0">
                            <h2 className="text-2xl mb-4">tell us who you are on social media</h2>
                            <div className="mb-4 relative">
                                <label htmlFor="instagram" className="block">instagram (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="instagram" 
                                    defaultValue={props.data.instagram}
                                    {...register('instagram')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="tik_tok" className="block">tik tok (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="tik_tok" 
                                    defaultValue={props.data.tik_tok}
                                    {...register('tik_tok')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="twitter" className="block">twitter (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="twitter" 
                                    defaultValue={props.data.twitter}
                                    {...register('twitter')}
                                />
                            </div>
                            <div className="mb-4 relative">
                                <label htmlFor="facebook" className="block">facebook (optional)</label>
                                <input 
                                    className="w-[100%]"
                                    type="text" 
                                    name="facebook" 
                                    defaultValue={props.data.facebook}
                                    {...register('facebook')}
                                />
                            </div>
                        </div>
                    </div>

                  <button type="submit" className="yellow-button">submit</button>
              </form>
              
            </div>

            <ErrorModal
                onClose={() => setShowErrorModal(false)}
                show={showErrorModal}
                content={errorContent}
            ></ErrorModal>
            
        </div>
    )
}

/*Page.getLayout = function getLayout(page) {
    return (
      
        <FullWidthLayout>
            {page}
        </FullWidthLayout>
      
    )
  }*/