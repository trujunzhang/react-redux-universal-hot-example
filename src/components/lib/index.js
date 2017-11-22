import Telescope from './config'

// extensions
Telescope.registerComponent('Loading',                                        require('./extensions/Loading.jsx'))
Telescope.registerComponent('MailTo',                                         require('./extensions/MailTo.jsx'))
Telescope.registerComponent('BlurryImage',                                    require('./extensions/BlurryImage.jsx'))
Telescope.registerComponent('AvatarBlurryImage',                              require('./extensions/AvatarBlurryImage.jsx'))
Telescope.registerComponent('UsersBlurryImageAvatar',                         require('./extensions/UsersBlurryImageAvatar.jsx'))


// common
Telescope.registerComponent('AppFooter',                              require('./applayout/AppFooter.jsx'))
Telescope.registerComponent('F8UserAvatorSection',                    require('./common/F8UserAvatorSection.jsx'))
Telescope.registerComponent('F8AppAlertSection',                      require('./common/F8AppAlertSection.jsx'))
Telescope.registerComponent('F8PlaceHolderImage',                     require('./common/F8PlaceHolderImage.jsx'))
Telescope.registerComponent('PostsVotingContainer',                   require('./common/PostsVotingContainer.jsx'))
Telescope.registerComponent('Error404',                               require('./common/Error404.jsx'))


// App
Telescope.registerComponent('AppAbout',                                    require('./sidebar/widgetapps/AppAbout.jsx'))
Telescope.registerComponent('AppCareers',                                  require('./sidebar/widgetapps/AppCareers.jsx'))
Telescope.registerComponent('AppContact',                                  require('./sidebar/widgetapps/AppContact.jsx'))
Telescope.registerComponent('AppPrivacy',                                  require('./sidebar/widgetapps/AppPrivacy.jsx'))
Telescope.registerComponent('AppTermsOfService',                           require('./sidebar/widgetapps/AppTermsOfService.jsx'))
Telescope.registerComponent('WidgetMobileApps',                            require('./sidebar/widgetapps/WidgetMobileApps.jsx'))


// Sidebar
Telescope.registerComponent('AppSideBar',                                  require('./sidebar/AppSideBar.jsx'))
Telescope.registerComponent('WidgetAppFooter',                             require('./sidebar/WidgetAppFooter.jsx'))
Telescope.registerComponent('WidgetHeader',                                require('./sidebar/WidgetHeader.jsx'))
Telescope.registerComponent('WidgetTopics',                                require('./sidebar/WidgetTopics.jsx'))
Telescope.registerComponent('WidgetAppFollower',                           require('./sidebar/WidgetAppFollower.jsx'))

// Sidebar(calender)
Telescope.registerComponent('Week',                                          require('./sidebar/widgetscalendar/Week.jsx'))
Telescope.registerComponent('DayNames',                                      require('./sidebar/widgetscalendar/DayNames.jsx'))
Telescope.registerComponent('WidgetCalendar',                                require('./sidebar/widgetscalendar/WidgetCalendar.jsx'))

// Sidebar(widget)
Telescope.registerComponent('TwitterTimeline',                                          require('./sidebar/widgettwitter/TwitterTimeline.jsx'))
Telescope.registerComponent('WidgetTwitter',                                            require('./sidebar/widgettwitter/WidgetTwitter.jsx'))


// Table Options
Telescope.registerComponent('AppTopHero',                              require('./applayout/banners/AppTopHero.jsx'))
Telescope.registerComponent('Newsletter',                              require('./applayout/banners/Newsletter.jsx'))

// header(app)
Telescope.registerComponent('HeaderContent',                    require('./applayout/appheader/HeaderContent.jsx'))
Telescope.registerComponent('HeaderContentSearchBar',           require('./applayout/appheader/HeaderContentSearchBar.jsx'))
Telescope.registerComponent('HeaderRightLoginPanel',            require('./applayout/appheader/HeaderRightLoginPanel.jsx'))
Telescope.registerComponent('HeaderRightUserPanel',             require('./applayout/appheader/HeaderRightUserPanel.jsx'))

// overlay
Telescope.registerComponent('AppPopup',                                    require('./overlay/AppPopup.jsx'))
Telescope.registerComponent('MoreTagsPopoverMenu',                         require('./overlay/MoreTagsPopoverMenu.jsx'))
Telescope.registerComponent('UsersPopoverMenu',                            require('./overlay/UsersPopoverMenu.jsx'))
Telescope.registerComponent('SubmitFlagPopover',                           require('./overlay/SubmitFlagPopover.jsx'))
Telescope.registerComponent('UsersPopoverDeleteConfirm',                   require('./overlay/UsersPopoverDeleteConfirm.jsx'))


// overlay(collection)
Telescope.registerComponent('CollectionsResult',                                         require('./overlay/user/CollectionsResult.jsx'))
Telescope.registerComponent('UserCollectionsPopover',                                    require('./overlay/user/UserCollectionsPopover.jsx'))


// Posts
Telescope.registerComponent('PostsDailyWithSidebarPage',             require('./posts/PostsDailyWithSidebarPage.jsx'))
Telescope.registerComponent('PostsListWithSidebarPage',              require('./posts/PostsListWithSidebarPage.jsx'))
Telescope.registerComponent('PostsDaily',                            require('./posts/PostsDaily.jsx'))
Telescope.registerComponent('PostsListTitle',                        require('./posts/PostsListTitle.jsx'))
Telescope.registerComponent('PostsLoading',                          require('./posts/PostsLoading.jsx'))
Telescope.registerComponent('PostsPopularThisWeek',                  require('./posts/PostsPopularThisWeek.jsx'))
Telescope.registerComponent('PostsDay',                              require('./posts/PostsDay.jsx'))
Telescope.registerComponent('PostsList',                             require('./posts/PostsList.jsx'))

// Posts(item)
Telescope.registerComponent('PostsItem',                                  require('./posts/items/PostsItem.jsx'))
Telescope.registerComponent('PostsDomain',                                require('./posts/items/PostsDomain.jsx'))
Telescope.registerComponent('PostsVotingView',                            require('./posts/items/PostsVotingView.jsx'))
Telescope.registerComponent('PostsItemActions',                           require('./posts/items/PostsItemActions.jsx'))
Telescope.registerComponent('PostsCommenters',                            require('./posts/items/PostsCommenters.jsx'))
Telescope.registerComponent('PostsItemTopics',                            require('./posts/items/PostsItemTopics.jsx'))
Telescope.registerComponent('PostsLoadMore',                              require('./posts/items/PostsLoadMore.jsx'))
Telescope.registerComponent('PostsNoResults',                             require('./posts/items/PostsNoResults.jsx'))



// users(sign in/up)
Telescope.registerComponent('UserEmailSignIn',                    require('./usersign/UserEmailSignIn.jsx'))
Telescope.registerComponent('UserEmailSignUp',                    require('./usersign/UserEmailSignUp.jsx'))
Telescope.registerComponent('UserLoginLayout',                    require('./usersign/UserLoginLayout.jsx'))
Telescope.registerComponent('UserLoginMain',                      require('./usersign/UserLoginMain.jsx'))
Telescope.registerComponent('UsersResetPassword',                 require('./usersign/UsersResetPassword.jsx'))
Telescope.registerComponent('UsersVerifyEmail',                   require('./usersign/UsersVerifyEmail.jsx'))
Telescope.registerComponent('UsersVerifyDeletion',                require('./usersign/UsersVerifyDeletion.jsx'))


export default Telescope;
