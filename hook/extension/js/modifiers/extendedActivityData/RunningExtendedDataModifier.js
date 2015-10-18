var RunningExtendedDataModifier = AbstractExtendedDataModifier.extend(function(base) {

    return {


        init: function(activityProcessor, activityId, activityType, appResources, userSettings, athleteId, athleteIdAuthorOfActivity, basicInfos, type) {
            base.init.call(this, activityProcessor, activityId, activityType, appResources, userSettings, athleteId, athleteIdAuthorOfActivity, basicInfos, type);
        },

        insertContentSummaryGridContent: function() {

            base.insertContentSummaryGridContent.call(this); // Super call

            var speedUnitPerhour = this.speedUnitsData[0];
            var speedUnitFactor = this.speedUnitsData[1];
            var distanceUnits = this.speedUnitsData[2];

            // Speed and pace
            var q3Move = '-';
            if (this.analysisData_.speedData && this.userSettings_.displayAdvancedSpeedData) {
                q3Move = Helper.secondsToHHMMSS((this.analysisData_.paceData.upperQuartilePace / speedUnitFactor).toFixed(0)).replace('00:', '');
                this.insertContentAtGridPosition(1, 0, q3Move, '75% Quartile Pace', '/' + distanceUnits, 'displayAdvancedSpeedData');
            }

            // Avg climb pace
            var climbSpeed = '-';
            if (this.analysisData_.gradeData && this.userSettings_.displayAdvancedGradeData) {
                var seconds = parseInt((this.analysisData_.gradeData.upFlatDownMoveData.up / speedUnitFactor).toFixed(0));
                if (seconds) {
                    climbSpeed = Helper.secondsToHHMMSS(seconds).replace('00:', '');
                }
                this.insertContentAtGridPosition(1, 2, climbSpeed, 'Avg climbing pace', '/' + distanceUnits, 'displayAdvancedGradeData');
            }
        },

        setDataViewsNeeded: function() {

            base.setDataViewsNeeded.call(this);

            // Pace view
            if (this.analysisData_.paceData && this.userSettings_.displayAdvancedSpeedData) {

                var measurementPreference = currentAthlete.get('measurement_preference');
                var units = (measurementPreference == 'meters') ? '/km' : '/mi';

                var paceDataView = new PaceDataView(this.analysisData_.paceData, units);
                paceDataView.setAppResources(this.appResources_);
                paceDataView.setIsAuthorOfViewedActivity(this.isAuthorOfViewedActivity);
                this.dataViews.push(paceDataView);
            }

            if (this.analysisData_.cadenceData && this.userSettings_.displayCadenceData) {
                var runningCadenceDataView = new RunningCadenceDataView(this.analysisData_.cadenceData, 'spm', this.userSettings_);
                runningCadenceDataView.setAppResources(this.appResources_);
                runningCadenceDataView.setIsAuthorOfViewedActivity(this.isAuthorOfViewedActivity);
                this.dataViews.push(runningCadenceDataView);
            }

            if (this.analysisData_.gradeData && this.userSettings_.displayAdvancedGradeData) {
                var runnningGradeDataView = new RunnningGradeDataView(this.analysisData_.gradeData, '%');
                runnningGradeDataView.setAppResources(this.appResources_);
                runnningGradeDataView.setIsAuthorOfViewedActivity(this.isAuthorOfViewedActivity);
                this.dataViews.push(runnningGradeDataView);
            }

            if (this.analysisData_.elevationData && this.userSettings_.displayAdvancedElevationData) {
                var elevationDataView = new ElevationDataView(this.analysisData_.elevationData, 'm');
                elevationDataView.setAppResources(this.appResources_);
                elevationDataView.setIsAuthorOfViewedActivity(this.isAuthorOfViewedActivity);
                this.dataViews.push(elevationDataView);
            }

        }
    }
});
