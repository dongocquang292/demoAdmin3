import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Dashboard } from '../Components/Dashboard';
import { ManageUser } from '../Components/ManageUser';
import { Login } from '../Components/Login';
import { NotFound } from '../Components/NotFound';
import { Registration } from '../Components/Registration';
import { UploadPage } from '../Components/UploadPage';
import { EditUserPage } from '../Components/EditUserPage';
import { OpenFilePage } from '../Components/OpenFilePage';
import { ResetPass } from '../Components/ResetPass';
import { PageReset } from '../Components/PageReset';
const Allroutes = () => {
    return (

        <div>
            <Switch>
                {/* <Route exact path="/*" component={UploadPage} /> */}
                <Route exact path="/" component={Login} />
                <Route exact path="/upload" component={UploadPage} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/manageUser" component={ManageUser} />
                <Route exact path="/registration" component={Registration} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/edit" component={EditUserPage} />
                <Route exact path="/open" component={OpenFilePage} />
                <Route exact path="/resetpass" component={ResetPass} />
                <Route exact path="/pagereset" component={PageReset} />
                <Route component={NotFound} />
            </Switch>
        </div >
    )
}

export { Allroutes }