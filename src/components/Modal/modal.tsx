import { useEffect, useState } from 'react';
import './modal.css';
import CryptoJS from 'crypto-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Modal = (props: any) => {
  let key: any = '12345678901234567890123456789012';
  key = CryptoJS.enc.Utf8.parse(key);

  let iv: any = '1234567890123456';
  iv = CryptoJS.enc.Utf8.parse(iv);

  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState<any>({
    siteName: '',
    url: '',
    sector: '',
    userName: '',
    sitePassword: '',
    notes: '',
  });

  const currentUser = localStorage.getItem('currentUser') || '[]';

  const previousData: any = JSON.parse(
    localStorage.getItem(JSON.stringify(currentUser)) || '[]'
  );

  console.log('previous', previousData);

  const onChangeHandler = (e: any) => {
    setValue(e.target.value);
  };

  const currentItem = previousData[props.element];
  if (currentItem) {
    currentItem.sitePassword = CryptoJS.AES.decrypt(
      currentItem.sitePassword,
      key,
      {
        iv: iv,
      }
    ).toString(CryptoJS.enc.Utf8);
  }

  useEffect(() => {
    setValue({
      siteName:
        props.props === 'Site Details'
          ? currentItem
            ? currentItem.siteName
            : ''
          : '',
      url:
        props.props === 'Site Details'
          ? currentItem
            ? currentItem.url
            : ''
          : '',
      sector:
        props.props === 'Site Details'
          ? currentItem
            ? currentItem.sector
            : ''
          : '',
      userName:
        props.props === 'Site Details'
          ? currentItem
            ? currentItem.userName
            : ''
          : '',
      sitePassword:
        props.props === 'Site Details'
          ? currentItem
            ? currentItem.sitePassword
            : ''
          : '',
      notes:
        props.props === 'Site Details'
          ? currentItem
            ? currentItem.notes
            : ''
          : '',
    });
  }, []);

  const editVal = () => {
    if (props.props === 'Add Site') {
      setEdit(true);
    }
  };

  useEffect(() => {
    editVal();
  });

  const submitHandler = (e: any) => {
    e.preventDefault();

    const newData = {
      siteName: e.target.siteName.value,
      url: e.target.url.value,
      sector: e.target.sector.value,
      userName: e.target.userName.value,
      sitePassword: CryptoJS.AES.encrypt(e.target.sitePassword.value, key, {
        iv: iv,
      }).toString(),
      notes: e.target.notes.value,
      icon: '',
    };

    console.log('new data', value);

    if (
      newData.siteName !== '' &&
      newData.url !== '' &&
      newData.userName !== '' &&
      newData.sitePassword !== '' &&
      newData.sector !== ''
    ) {
      if (props.props === 'Add Site') {
        let repeat: any[] = [];
        previousData.map((ele: any) => {
          if (newData.siteName === ele.siteName) {
            repeat.push('repeat');
          }
        });

        console.log('repeate', repeat.includes('repeat'));
        if (repeat.includes('repeat')) {
          dataExists(
            'Site Name already exist please enter different site name...'
          );
        } else {
          previousData.push(newData);
          console.log('P', previousData);
          localStorage.setItem(
            JSON.stringify(currentUser),
            JSON.stringify(previousData)
          );
          dataAddedSuccessfully('Data added successfully');
        }
      } else if (props.props === 'Site Details') {
        let repeated: any[] = [];
        previousData.map((ele: any, index: number) => {
          if (props.element !== index && newData.siteName === ele.siteName) {
            repeated.push('repeat');
          }
        });
        if (repeated.includes('repeat')) {
          dataExists(
            'Site Name already exist please enter different site name...'
          );
        } else {
          previousData[props.element] = newData;

          localStorage.setItem(
            JSON.stringify(currentUser),
            JSON.stringify(previousData)
          );
          dataAddedSuccessfully('Data edited successful');
        }
      }
    } else {
      dataExists('Please enter all the required fields');
    }
  };

  const dataExists = (message: string) =>
    toast.warning(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

  const dataAddedSuccessfully = (message: string) =>
    toast.success(message, {
      position: 'top-center',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

  return (
    <>
      <div className="modalBody">
        <div className="modalMobileTopbar"></div>
        <div className="modalTitle">{props.props}</div>
        {props.props === 'Site Details' && !edit ? (
          <div className="modaledit">
            <button
              className="modalEditButton"
              onClick={() => {
                setEdit(!edit);
                if (props.props === 'Add Site') {
                  setEdit(true);
                }
              }}
            >
              Edit
            </button>
          </div>
        ) : (
          ''
        )}

        <form className="modalBodyForm" onSubmit={submitHandler}>
          <div className="modalInput occupy">
            <div>URL</div>
            <input
              type="text"
              name="url"
              className="modalInputBar"
              onChange={onChangeHandler}
              value={edit ? value.url : currentItem && currentItem.url}
            />
          </div>
          <div className="modalInput">
            <div>Site Name</div>
            <input
              type="text"
              name="siteName"
              className="modalInputBar"
              onChange={onChangeHandler}
              value={
                edit ? value.siteName : currentItem && currentItem.siteName
              }
            />
          </div>
          <div className="modalInput">
            <div>Sector/Folder</div>

            <select
              name="sector"
              className="modalInputBar"
              onChange={onChangeHandler}
              value={edit ? value.sector : currentItem && currentItem.sector}
            >
              {' '}
              <option value="Social Media">Social Media</option>
              <option value="Finance">Finance</option>
              <option value="Business">Business</option>
            </select>
          </div>
          <div className="modalInput">
            <div>User Name</div>
            <input
              type="text"
              name="userName"
              className="modalInputBar"
              onChange={onChangeHandler}
              value={
                edit ? value.userName : currentItem && currentItem.userName
              }
            />
          </div>
          <div className="modalInput">
            <div>Site Password</div>

            <input
              type="text"
              name="sitePassword"
              className="modalInputBar"
              onChange={onChangeHandler}
              value={
                edit
                  ? value.sitePassword
                  : currentItem && currentItem.sitePassword
              }
            />
          </div>
          <div className="modalInput occupy">
            <div>Notes</div>
            <textarea className="modalInputBar" name="notes" />
          </div>
          <div></div>
          {props.props === 'Add Site' ? (
            <div className="modalButtons">
              <button
                className="modalButton modalResetButton"
                type="button"
                onClick={() => {
                  setValue({
                    siteName: '',
                    url: '',
                    sector: '',
                    userName: '',
                    sitePassword: '',
                    notes: '',
                  });
                }}
              >
                Reset
              </button>
              <button className="modalButton modalSaveButton" type="submit">
                Save
              </button>
            </div>
          ) : (
            ''
          )}
          {props.props === 'Site Details' ? (
            <div className="modalButtons">
              {edit && (
                <button className="modalButton modalSaveButton">Update</button>
              )}
            </div>
          ) : (
            ''
          )}
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Modal;
