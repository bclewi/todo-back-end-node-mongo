interface CreateData {
  textBody: string;
  [x: string]: any;
}

interface ReadData {
  id: string;
}

interface UpdateData {
  id: string;
  textBody?: string;
  [x: string]: any;
}

interface DeleteData {
  id: string;
}

export { CreateData, ReadData, UpdateData, DeleteData };
