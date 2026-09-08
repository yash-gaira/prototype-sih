export type AyushSystem = "Ayurveda" | "Homoeopathy" | "Unani" | "Siddha" | "Yoga & Naturopathy" | "Sowa Rigpa";

export interface Hospital {
  id: string;
  name: string;
  type: string;
  systems: string[];
  address: string;
  district: string;
  state: string;
  status: string;
}

export const ayushHospitals: Hospital[] = [
  {
    id: "AN001",
    name: "Integrated AYUSH Hospital – Junglighat",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Junglighat, Port Blair",
    district: "South Andaman",
    state: "Andaman & Nicobar Islands",
    status: "Functional"
  },
  {
    id: "AP001",
    name: "Integrated AYUSH Hospital – Kakinada",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Kakinada, Andhra Pradesh",
    district: "Kakinada",
    state: "Andhra Pradesh",
    status: "Construction Completed"
  },
  {
    id: "AP002",
    name: "Integrated AYUSH Hospital – Visakhapatnam",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Visakhapatnam, Andhra Pradesh",
    district: "Visakhapatnam",
    state: "Andhra Pradesh",
    status: "Under construction"
  },
  {
    id: "AS001",
    name: "Integrated AYUSH Hospital – Dudhnoi",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda"],
    address: "Dudhnoi, Goalpara, Assam",
    district: "Goalpara",
    state: "Assam",
    status: "Functional"
  },
  {
    id: "BR001",
    name: "Integrated AYUSH Hospital – Patna",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani", "Yoga"],
    address: "Patna, Bihar",
    district: "Patna",
    state: "Bihar",
    status: "Construction Completed"
  },
  {
    id: "CH001",
    name: "Integrated AYUSH Hospital – Sector 34",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy"],
    address: "Sector 34, Chandigarh",
    district: "Chandigarh",
    state: "Chandigarh",
    status: "Functional"
  },
  {
    id: "CG001",
    name: "Integrated AYUSH Hospital – Janjgir-Champa",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani"],
    address: "Janjgir-Champa, Chhattisgarh",
    district: "Janjgir-Champa",
    state: "Chhattisgarh",
    status: "Functional"
  },
  {
    id: "GA001",
    name: "Integrated AYUSH Hospital – Velguem",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Velguem, North Goa",
    district: "North Goa",
    state: "Goa",
    status: "Under construction"
  },
  {
    id: "GJ001",
    name: "Integrated AYUSH Hospital – Surat",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga"],
    address: "Surat, Gujarat",
    district: "Surat",
    state: "Gujarat",
    status: "Construction Completed"
  },
  {
    id: "HR001",
    name: "Integrated AYUSH Hospital – Hisar",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani", "Yoga"],
    address: "Hisar, Haryana",
    district: "Hisar",
    state: "Haryana",
    status: "Functional"
  },
  {
    id: "HP001",
    name: "Integrated AYUSH Hospital – Kullu",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Sowa Rigpa", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Kullu, Himachal Pradesh",
    district: "Kullu",
    state: "Himachal Pradesh",
    status: "Under construction"
  },
  {
    id: "JK004",
    name: "Integrated AYUSH Hospital – Kulgam",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani", "Yoga & Naturopathy"],
    address: "Kulgam, Jammu & Kashmir",
    district: "Kulgam",
    state: "Jammu & Kashmir",
    status: "Functional"
  },
  {
    id: "JH006",
    name: "Integrated AYUSH Hospital – Dumka",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy"],
    address: "Dumka, Jharkhand",
    district: "Dumka",
    state: "Jharkhand",
    status: "Construction Completed"
  },
  {
    id: "KA001",
    name: "Integrated AYUSH Hospital – Gadag",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy"],
    address: "Gadag, Karnataka",
    district: "Gadag",
    state: "Karnataka",
    status: "Functional"
  },
  {
    id: "KL001",
    name: "Integrated AYUSH Hospital – Chalakudy",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Siddha", "Yoga & Naturopathy"],
    address: "Chalakudy, Thrissur, Kerala",
    district: "Thrissur",
    state: "Kerala",
    status: "Construction Completed"
  },
  {
    id: "LD001",
    name: "Integrated AYUSH Hospital – Kavaratti",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani"],
    address: "Kavaratti, Lakshadweep",
    district: "Lakshadweep",
    state: "Lakshadweep",
    status: "Functional"
  },
  {
    id: "MH001",
    name: "Integrated AYUSH Hospital – Nandurbar",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani"],
    address: "Nandurbar, Maharashtra",
    district: "Nandurbar",
    state: "Maharashtra",
    status: "Functional"
  },
  {
    id: "MN001",
    name: "Integrated AYUSH Hospital – Moreh",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Moreh, Tengnoupal, Manipur",
    district: "Tengnoupal",
    state: "Manipur",
    status: "Functional"
  },
  {
    id: "MP001",
    name: "Integrated AYUSH Hospital – Bhopal",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Yoga"],
    address: "Bhopal, Madhya Pradesh",
    district: "Bhopal",
    state: "Madhya Pradesh",
    status: "Functional"
  },
  {
    id: "ML001",
    name: "Integrated AYUSH Hospital – Sohra",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Sohra, East Khasi Hills, Meghalaya",
    district: "East Khasi Hills",
    state: "Meghalaya",
    status: "Functional"
  },
  {
    id: "NL001",
    name: "Integrated AYUSH Hospital – Noklak",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga"],
    address: "Noklak, Nagaland",
    district: "Noklak",
    state: "Nagaland",
    status: "Functional"
  },
  {
    id: "OD001",
    name: "Integrated AYUSH Hospital – Dhenkanal",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Dhenkanal, Odisha",
    district: "Dhenkanal",
    state: "Odisha",
    status: "Construction Completed"
  },
  {
    id: "PY001",
    name: "Integrated AYUSH Hospital – Villianur",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Siddha"],
    address: "Villianur, Puducherry",
    district: "Puducherry",
    state: "Puducherry",
    status: "Functional"
  },
  {
    id: "PB002",
    name: "Integrated AYUSH Hospital – Moga",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani", "Yoga & Naturopathy"],
    address: "Moga, Punjab",
    district: "Moga",
    state: "Punjab",
    status: "Functional"
  },
  {
    id: "RJ001",
    name: "Integrated AYUSH Hospital – Bhilwara",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani"],
    address: "Bhilwara, Rajasthan",
    district: "Bhilwara",
    state: "Rajasthan",
    status: "Functional"
  },
  {
    id: "SK001",
    name: "Integrated AYUSH Hospital – Kyongsa",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy"],
    address: "Kyongsa, Gyalshing, Sikkim",
    district: "Gyalshing",
    state: "Sikkim",
    status: "Functional"
  },
  {
    id: "TN001",
    name: "Integrated AYUSH Hospital – Theni",
    type: "Integrated AYUSH Hospital",
    systems: ["Siddha", "Yoga & Naturopathy"],
    address: "Theni, Tamil Nadu",
    district: "Theni",
    state: "Tamil Nadu",
    status: "Functional"
  },
  {
    id: "TS001",
    name: "Integrated AYUSH Hospital – Siddipet",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Unani", "Siddha", "Yoga & Naturopathy"],
    address: "Siddipet, Telangana",
    district: "Siddipet",
    state: "Telangana",
    status: "Construction Completed"
  },
  {
    id: "TR001",
    name: "Integrated AYUSH Hospital – Paradise Chowmuhani",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy", "Yoga & Naturopathy"],
    address: "Agartala, West Tripura, Tripura",
    district: "West Tripura",
    state: "Tripura",
    status: "Functional"
  },
  {
    id: "UP010",
    name: "Integrated AYUSH Hospital – Orai",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Unani", "Homoeopathy", "Yoga"],
    address: "Orai, Jalaun, Uttar Pradesh",
    district: "Jalaun",
    state: "Uttar Pradesh",
    status: "Functional"
  },
  {
    id: "UK001",
    name: "Integrated AYUSH Hospital – Haldwani",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Homoeopathy"],
    address: "Haldwani, Nainital, Uttarakhand",
    district: "Nainital",
    state: "Uttarakhand",
    status: "Functional"
  },
  {
    id: "WB001",
    name: "Integrated AYUSH Hospital – Topsikhata",
    type: "Integrated AYUSH Hospital",
    systems: ["Ayurveda", "Unani", "Homoeopathy", "Yoga"],
    address: "Topsikhata, Alipurduar, West Bengal",
    district: "Alipurduar",
    state: "West Bengal",
    status: "Functional"
  }
];
