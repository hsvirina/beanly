// import React from 'react';
// import './ProfilePage.scss';

// export const ProfilePage: React.FC = () => {
//   return (
//     <div className="profilePage">
//       {/* Personal Top */}
//       <div className="profilePage__personal-top">
//         <div className="profilePage__avatar-section">
//           <img
//             src={user.photoUrl || '/default-avatar.png'}
//             alt="Profile"
//             className="profilePage__avatar"
//           />
//           <div className="profilePage__info">
//             <h3 className="profilePage__name">{user.userName || 'User'}</h3>
//             <p className="profilePage__location">{user.location}</p>
//             <p className="profilePage__status">{user.status}</p>
//           </div>
//         </div>
//         <button
//           className="profilePage__edit-btn button-font"
//           onClick={() => alert('Edit Profile clicked')}
//         >
//           Edit Profile
//         </button>
//       </div>

//       {/* Personal Details */}
//       <div className="profilePage__personal-details">
//         <div className="profilePage__detail-block">
//           <img
//             src="./icons/id-pass.png"
//             alt="Full name icon"
//             className="profilePage__detail-icon"
//           />
//           <div>
//             <span className="profilePage__detail-title body-font-1">
//               Full Name
//             </span>
//             <span className="profilePage__detail-value menu-text-font">
//               {user.userName || 'User'}
//             </span>
//           </div>
//         </div>
//         <div className="profilePage__detail-block">
//           <img
//             src="./icons/location.png"
//             alt="Location icon"
//             className="profilePage__detail-icon"
//           />
//           <div>
//             <span className="profilePage__detail-title body-font-1">
//               Location
//             </span>
//             <span className="profilePage__detail-value menu-text-font">
//               {user.location}
//             </span>
//           </div>
//         </div>
//         <div className="profilePage__detail-block">
//           <img
//             src="./icons/letter.png"
//             alt="Email icon"
//             className="profilePage__detail-icon"
//           />
//           <div>
//             <span className="profilePage__detail-title body-font-1">
//               Email
//             </span>
//             <span className="profilePage__detail-value menu-text-font">
//               {user.email}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Favorites */}
//       <div className="profilePage__favorites">
//         <h4>Favorite Cafés</h4>
//         {/* TODO: вывести избранные */}
//       </div>

//       {/* Settings */}
//       <div className="profilePage__settings">
//         <ProfileSettings settings={settings} onChange={setSettings} />
//       </div>

//       {/* Save / Logout */}
//       <div className="profilePage__actions">
//         <button
//           className="profilePage__save-btn button-font"
//           onClick={handleSave}
//           disabled={saving}
//         >
//           {saving ? 'Saving...' : 'Save All Changes'}
//         </button>
//         <button
//           className="profilePage__logout-btn button-font"
//           onClick={logout}
//           disabled={saving}
//         >
//           Logout
//         </button>
//       </div>

//       {/* Сообщения об ошибках и успехе */}
//       {error && <div className="profilePage__error">{error}</div>}
//       {successMessage && (
//         <div className="profilePage__success">{successMessage}</div>
//       )}
//     </div>
//   );
// };