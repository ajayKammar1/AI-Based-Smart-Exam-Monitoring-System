from ai.face_registration.register import FaceRegistration


def main():

    name = input("Enter Student Name: ").strip()

    registration = FaceRegistration()

    registration.register(name)


if __name__ == "__main__":
    main()