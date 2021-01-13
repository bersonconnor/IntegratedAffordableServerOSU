import db from "../database/DatabaseConnection";
const connectionPool = db.getInstance()

export class ActivityService {

    public addActivity = (req, res) => {
        const activity = [
            [
                req.body.IP_addr,
                req.body.username,
                req.body.Last_Act,
                req.body.city,
                req.body.state,
                req.body.Timestamp
            ]
        ];

        const activity_sql = 'INSERT INTO activitylog VALUES ?';

        connectionPool.query(activity_sql, [activity], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                console.log('User Registration Records inserted');
            }
        });
    }

    //backend function to retrieve the users last actvity on their profile
    public getLastActivity = (req, res) => {

        const sql = 'SELECT * FROM activitylog WHERE Username = ?';
        console.log(req.body.username)
        connectionPool.query(sql, [req.body.username], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                const actList = [];

                for (let i = 0; i < results.length; ++i) {
                    actList.push(
                        {
                            Last_Act: results[i].Last_Act

                        }
                    );
                }
                res.status(200).json({
                    success: 'Last Activity Found',
                    activities: actList
                });
            }
        });
    };


    //backend function to retrieve the users last login on their profile
    public getLastLogIn = (req, res) => {
        const sql = 'SELECT * FROM activitylog WHERE Username = ?';

        connectionPool.query(sql, [req.body.username], (error, results, fields) => {
            if (error) {
                console.log(error);
                res.status(502).json({ error });
            } else {
                const timeList = [];

                for (let i = 0; i < results.length; ++i) {
                    timeList.push(
                        {
                            Timestamp: results[i].Timestamp
                        }
                    );
                }

                res.status(200).json({
                    success: 'times Found',
                    Timelog: timeList
                });
            }
        });

    };


    //backend function to retrieve the users last login on their profile
    public getIPAddr = (req, res) => {
        const sql = 'SELECT IP_addr FROM activitylog WHERE Username = ?';
        connectionPool.query(sql, [req.body.username], (error, results, fields) => {
            if (error) {
                console.log("get ip addr error:" + error);
                res.status(502).json({ error });
            } else {
                res.status(200).json({
                    success: 'IP Found',
                    IP_addr: results[0].IP_addr
                });

            }
        });

    };
}