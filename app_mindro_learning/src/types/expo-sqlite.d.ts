declare module 'expo-sqlite' {
    export interface SQLiteDatabase {
        transaction: (callback: (tx: SQLTransaction) => void, errorCallback?: (error: Error) => void, successCallback?: () => void) => void;
    }

    export interface SQLTransaction {
        executeSql: (sqlStatement: string, args?: any[], callback?: (tx: SQLTransaction, result: SQLResultSet) => void, errorCallback?: (tx: SQLTransaction, error: Error) => void) => void;
    }

    export interface SQLResultSet {
        insertId?: number;
        rowsAffected: number;
        rows: {
            length: number;
            item: (index: number) => any;
            _array: any[];
        };
    }

    export function openDatabaseSync(name: string): SQLiteDatabase;
} 